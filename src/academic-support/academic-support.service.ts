import { Injectable } from '@nestjs/common';
import { CreateAcademicSupportDto } from './dto/create-academic-support.dto';
import { UpdateAcademicSupportDto } from './dto/update-academic-support.dto';
import { LangChainService } from 'src/shared/langchain/langchain-service';
import { GradeService } from 'src/grade/grade.service';
import { Types } from 'mongoose';
import { TopicsService } from 'src/topics/topics.service';
import { UsersService } from 'src/users/users.service';
import { Subtopic, TopicDocument } from 'src/topics/entities/topic.entity';
import { SubjectsService } from 'src/subjects/subjects.service';
import { GradeDocument } from 'src/grade/entities/grade.entity';
import { DropboxService } from 'src/dropbox/dropbox.service';
import { UploadDocument } from 'src/dropbox/entities/dropbox.entity';
import { InjectModel } from '@nestjs/mongoose';
import { AcademicSupport, AcademicSupportDocument } from './entities/academic-support.entity';
import { Model } from 'mongoose';

@Injectable()
export class AcademicSupportService {
  constructor(
    private readonly langChainService: LangChainService,
    private readonly gradeService: GradeService,
    private readonly topicService: TopicsService,
    private readonly userService: UsersService,
    private readonly subjectService: SubjectsService,
    private readonly uploadService: DropboxService,
    @InjectModel(AcademicSupport.name) private academicSupportModel: Model<AcademicSupportDocument>

  ) { }
  create(createAcademicSupportDto: CreateAcademicSupportDto) {
    return 'This action adds a new academicSupport';
  }

  findAll() {
    return `This action returns all academicSupport`;
  }

async findOne(id: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new Error('ID inválido');
  }

  const record = await this.academicSupportModel.findById(id).exec();

  if (!record) {
    throw new Error(`AcademicSupport con ID ${id} no encontrado`);
  }

  return record;
}
async findByIdOrStudentId(id: string) {
  return this.academicSupportModel.findOne({
    $or: [
      { _id: id },
      { 'student.id': id }
    ]
  }).exec();
}
async findByStudentIdAndTopicId(id: string, topicId: string) {
  return this.academicSupportModel.findOne({
    $and: [
      {
        $or: [
          { _id: id },
          { 'student.id': id },
        ]
      },
      { 'topic.id': topicId }
    ]
  }).exec();
}

  update(id: number, updateAcademicSupportDto: UpdateAcademicSupportDto) {
    return `This action updates a #${id} academicSupport`;
  }

  remove(id: number) {
    return `This action removes a #${id} academicSupport`;
  }

  async generateByTopic(topicId: string) {
    const topic = await this.topicService.findOne(topicId);
    const builtTopic = await this.buildTopic(topic);
    const gradesByTopic = await this.gradeService.findByTopicId(new Types.ObjectId(topicId));
    const generalSubtopics = topic.subtopics;
    const filterGradesBelowThreshold = this.gradeService.filterGradesBelowThreshold(gradesByTopic);
    const studentsBelowThreshold = await this.userService.findManyByField('_id', filterGradesBelowThreshold.map(grade => new Types.ObjectId(grade.userId)));
    const generalResourcesBySubtopicIds = await this.uploadService.findManyBySubtopicIds(generalSubtopics.map(subtopic => subtopic._id.toString()));
    const response: any = [];
    studentsBelowThreshold.forEach(async student => {
      const subtopicsBelowThreshold = this.buildSubtopicsBelowThreshold(generalSubtopics, gradesByTopic.filter(grade => grade.userId === (student._id as any).toString()));
      const resourcesBySubtopic = this.buildResourcesBySubtopic(subtopicsBelowThreshold, generalResourcesBySubtopicIds);
      const generated = await this.generateWithIa(builtTopic, subtopicsBelowThreshold, student.estilo || [], resourcesBySubtopic);
      const data = {
        student: {
          id: (student._id as any).toString(),
          nombre: student.name,
          email: student.email,
          estilosDeAprendizaje: student.estilo,
        },
        topic: {
          id: (topic._id as any).toString(),
          materia: builtTopic.materia,
          titulo: builtTopic.titulo,
        },
        subtopics: subtopicsBelowThreshold.map(subtopic => ({
          id: subtopic.id,
          titulo: subtopic.titulo,
          nota: subtopic.nota,
          notaMaxima: subtopic.notaMaxima,
        })),
        gradesByTopic: {
          id: gradesByTopic.map(grade => ({
            id: (grade._id as any).toString(),
            userId: (student._id as any).toString(),
            subtopicId: grade.subTopics.map(subtopic => ({
              nota: subtopic.grade
            })),
          })),
        },
        resourcesBySubtopic: resourcesBySubtopic.map(resource => ({
          id: resource.id,
          titulo: resource.titulo,
          tipo: resource.tipo,
          dropbuxUrl: resource.dropboxUrl,
          descripcion: resource.descripcion,
        })),
        generated,
      };
      response.push(data);
      await this.academicSupportModel.create(data);
      // Enviamos el mensaje cuando se genera el recurso
    });
    return response;
  }

  async generateWithIa(topic: { id: string, materia: string, titulo: string }, subtopics: { id: string, titulo: string, nota: number, notaMaxima: number }[], estilosDeAprendizaje: string[], resourcesBySubtopic: { id: string, titulo: string, tipo: string, dropboxUrl: string, descripcion: string, subtema: string | null }[]) {
    const prompt = this.buildPrompt(topic, subtopics, estilosDeAprendizaje, resourcesBySubtopic);
    return await this.langChainService.generate(prompt); // Esta respuesta viene en formato JSON
  }


  buildPrompt(tema: { id: string, materia: string, titulo: string }, subtemas: { id: string, titulo: string, nota: number, notaMaxima: number }[], estilosDeAprendizaje: string[], recursosDisponibles: { id: string, titulo: string, tipo: string, dropboxUrl: string, descripcion: string, subtema: string | null }[]): string {
    const prompt = `Eres un educador especializado en segundo año de bachillerato en Ecuador, experto en metodologías adaptadas a los estilos de aprendizaje según el cuestionario Honey-Alonso (CHAEA).

      Te proporcionaré la siguiente información:
      - Estilos de aprendizaje del estudiante.
      - Lista de subtemas que necesita reforzar.
      - Lista de recursos académicos disponibles (cada recurso incluye título, tipo, subtema relacionado y descripción).

      Tu tarea es:
      1. Analizar cuidadosamente los estilos de aprendizaje del estudiante.
      2. Leer todos los recursos disponibles.
      3. Seleccionar los recursos que mejor se adapten a los estilos de aprendizaje del estudiante, priorizando los que permitan desarrollar una tarea individual y autónoma.
      4. Diseñar una **actividad de refuerzo** orientada **a la creación de un documento entregable**, que el estudiante pueda trabajar en casa y entregar al profesor como evidencia de su aprendizaje.
      5. Asegurar que la actividad tenga **complejidad media**, adecuada al nivel de segundo de bachillerato, sin ser excesivamente simple ni demasiado difícil.
      6. Describir los **pasos concretos** que debe seguir el estudiante para completar la tarea y crear su documento entregable.
      

      **Importante**:
      - La actividad debe estar orientada exclusivamente a **un solo estudiante**.
      - Solo se pueden utilizar los recursos proporcionados, no inventes recursos nuevos.
      - El documento entregable debe ser claro en cuanto a lo que se espera: puede ser un resumen, un informe, una presentación escrita, un ensayo breve, un esquema conceptual, etc., según el tipo de recursos y los estilos de aprendizaje.
      - Indicar claramente en los pasos que el resultado final es un documento que será entregado al profesor.
      - Usar siempre un **JSON válido** como respuesta, siguiendo estrictamente esta estructura:

      {
        "recursos_recomendados": [
          {
            "titulo": "Título del recurso",
            "tipo": "Tipo de recurso (PDF, video, audio, imagen, texto, etc.)",
            "descripcion": "Descripción detallada del recurso",
            "dropbox_url": "URL de Dropbox donde se encuentra el recurso",
            "subtema": "Subtema relacionado"
          }
          // Puede haber más recursos
        ],
        "actividad_de_refuerzo": {
          "descripcion_general": "Descripción general de la actividad enfocada en la creación del documento entregable.",
          "pasos": [
            " Acción específica que debe realizar el estudiante.",
            " Acción específica que debe realizar el estudiante.",
            " Acción específica que debe realizar el estudiante."
            // Puede haber más pasos
          ],
          "tipo_documento_entregable": "Tipo de documento que el estudiante debe crear y entregar (por ejemplo: resumen, ensayo breve, informe, esquema, presentación escrita).",
          "objetivo": "Objetivo educativo que se busca alcanzar con esta actividad."
        },
        
      }
        
      ## Reglas estrictas:

      - No agregar nada fuera del JSON (ni saludos, ni explicaciones, solo el JSON).

      - No dejar ningún campo vacío.

      - Seleccionar siempre al menos un recurso por subtema que debe reforzarse.

      - La descripción general y los pasos deben ser completamente claros para que el estudiante sepa qué debe hacer sin ayuda adicional.

      - La actividad debe terminar indicando que el estudiante debe entregar el documento al profesor.

      ## Datos de entrada:

      - Estilos de aprendizaje: ${JSON.stringify(estilosDeAprendizaje)}

      - Tema: ${JSON.stringify(tema)}

      - Subtemas: ${JSON.stringify(subtemas)}

      - Recursos disponibles: ${JSON.stringify(recursosDisponibles)}

      ---

      ## 📋 **Notas de optimización**:
      - **Nuevo campo:** \`"tipo_documento_entregable"\` → Esto deja muy claro **qué tipo** de tarea debe producir el alumno.
      - **Enfoque total** en **tarea en casa** → No en actividades grupales, orales, o de exposición. Siempre escritura + entrega.
      - **Pasos detallados:** Cada paso debe ser súper concreto:  
        ➔ "Lee el recurso X" → "Subraya las ideas principales" → "Redacta un resumen de una página en Word" → "Entrega por correo o en físico".
      - **Objetivo claro:** Qué se busca reforzar con la actividad.

      ---
    `;

    return prompt;
  }

  private async buildTopic(topic: TopicDocument) {
    const subject = await this.subjectService.findOne(topic.subject._id.toString());
    return {
      id: (topic._id as any).toString(),
      materia: subject.name,
      titulo: topic.name,
    }
  }

  private buildSubtopicsBelowThreshold(subtopics: Subtopic[], gradesByUser: GradeDocument[]) {
    // Inicializar un array donde se almacenarán los subtemas con calificaciones por debajo del máximo
    const subtopicsBelowThreshold: { id: string, titulo: string, nota: number, notaMaxima: number }[] = [];

    // Iterar sobre cada GradeDocument (calificación por usuario)
    gradesByUser.forEach(gradeDoc => {
      // Iterar sobre cada subtema en la calificación
      gradeDoc.subTopics.forEach(subTopic => {
        // Buscar el subtema correspondiente en la lista de subtemas generales
        const subtopic = subtopics.find(st => st._id.toString() === subTopic.subTopicId);

        // Si se encuentra el subtema y su calificación es menor al máximo
        if (subtopic && (subTopic.grade < subtopic.maxScore)) {
          // Agregar el subtema con la calificación al resultado
          subtopicsBelowThreshold.push({
            id: subtopic._id.toString(),
            titulo: subtopic.name,
            nota: subTopic.grade,
            notaMaxima: subtopic.maxScore,
          });
        }
      });
    });

    return subtopicsBelowThreshold;
  }

  private buildResourcesBySubtopic(subtopics: { id: string, titulo: string, nota: number, notaMaxima: number }[], resources: UploadDocument[]) {
    return resources.map(resource => {
      const subtopic = subtopics.find(st => st.id === resource.subtopicId.toString());
      return {
        id: (resource._id as any).toString(),
        titulo: resource.fileName,
        tipo: resource.fileType,
        dropboxUrl: resource.dropboxUrl,
        descripcion: resource.description,
        subtema: subtopic ? subtopic.titulo : null,
      }
    }
    );
  }

}
