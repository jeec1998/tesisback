import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Grade, GradeDocument } from './entities/grade.entity';
import { CreateGradeDto } from './dto/create-grade.dto';
import { Topic, TopicDocument } from 'src/topics/entities/topic.entity';

export interface GradeSubtopicData {
  _id: unknown;
  userId: string;
  subjectId: string;
  topicId: string;
  subtopicId: string;
  grade: number;
}

@Injectable()
export class GradeService {
  constructor(
    @InjectModel(Grade.name) private gradeModel: Model<GradeDocument>,
    @InjectModel(Topic.name) private topicModel: Model<TopicDocument>,
  ) { }

  // Obtener todas las calificaciones
  async findAll(): Promise<Grade[]> {
    return this.gradeModel.find().exec();
  }

  // Obtener una calificación por su ID
  async findOne(id: Types.ObjectId): Promise<Grade> {
    const grade = await this.gradeModel.findById(id).exec();
    if (!grade) {
      throw new Error('Grade not found');
    }
    return grade;
  }

  // Buscar calificaciones por userId
  // Si userId se guarda como string en MongoDB, no lo conviertas a ObjectId
  async findByUserId(userId: string): Promise<Grade[]> {
    const grades = await this.gradeModel.find({ userId }).exec();
    if (!grades || grades.length === 0) {
      throw new Error('No grades found for this user');
    }
    return grades;
  }

  // Crear una nueva calificación
  async create(createGradeDto: CreateGradeDto): Promise<GradeDocument> {
    const { subTopics } = createGradeDto;
    const topicDocument = await this.topicModel.find({ 'subtopics._id': { $in: subTopics.map(subTopic => subTopic.subTopicId) } }).exec();

    // Se esta asegura que los subtemas existen y que las calificaciones no exceden el puntaje máximo
    for (const topic of topicDocument) {
      for (const subTopic of subTopics) {
        const subTopicData = topic.subtopics.find(st => st._id.toString() === subTopic.subTopicId.toString());
        if (!subTopicData) {
          throw new BadRequestException(`Subtopic ${subTopic.subTopicId} not found in topic ${topic.name}`);
        }
        if (subTopic.grade > subTopicData.maxScore) {
          throw new BadRequestException(`Grade for subtopic ${subTopicData.name} exceeds max score`);
        }
      }
    }
    // Calcula la calificación total
    const totalGrade = subTopics.reduce((acc, subTopic) => acc + subTopic.grade, 0);
    if (totalGrade > 10) {
      throw new BadRequestException('Total grade cannot exceed 10');
    }
    const createdGrade = new this.gradeModel({ ...createGradeDto, totalGrade });
    return createdGrade.save();
  }

  // Actualizar una calificación por su ID
  async update(id: Types.ObjectId, updateGradeDto: any): Promise<Grade> {
    const updatedGrade = await this.gradeModel.findByIdAndUpdate(id, updateGradeDto, { new: true }).exec();
    if (!updatedGrade) {
      throw new Error('Grade not found');
    }
    return updatedGrade;
  }

  // Eliminar una calificación por su ID
  async delete(id: Types.ObjectId): Promise<Grade> {
    const deletedGrade = await this.gradeModel.findByIdAndDelete(id).exec();
    if (!deletedGrade) {
      throw new Error('Grade not found');
    }
    return deletedGrade;
  }

async findByTopicId(topicId: Types.ObjectId): Promise<any[]> {
  // Asegurarte de que el campo 'totalRecoveryGrade' también esté en la consulta
  const grades = await this.gradeModel.find({ topicId: topicId.toString() }).exec();

  // Aquí también podrías modificar el proceso para devolver los valores correctos de 'totalRecoveryGrade'
  return grades.map(grade => ({
    ...grade.toObject(),
    totalRecoveryGrade: grade.totalRecoveryGrade ?? undefined  // Incluir totalRecoveryGrade si existe, undefined si no
  }));
}

 async findByUserAndSubject(userId: string, subjectId: Types.ObjectId): Promise<Grade[]> {
    return this.gradeModel.find({
      userId: userId,
      subjectId: subjectId,
    })
    // CAMBIO CLAVE: Usamos .populate() para obtener los documentos completos.
    .populate({
        path: 'topicId', // Puebla el campo 'topicId'
        select: 'titulo' // Selecciona solo el campo 'titulo' de Topic (y el _id por defecto)
    })
    .populate({
        path: 'subTopics.subTopicId', // Puebla el campo anidado 'subTopicId' dentro del array 'subTopics'
        select: 'titulo' // Selecciona solo el campo 'titulo' de SubTopic
    })
    .exec();
  }
  buildListGroupedBySubtopics(grades: GradeDocument[]) {
    const data: GradeSubtopicData[] = [];

    // Iterar sobre cada calificación (Grade)
    grades.forEach(grade => {
      // Iterar sobre cada subtema en la calificación
      grade.subTopics.forEach(subTopic => {
        // Crear un nuevo objeto con la información deseada
        const gradeData = {
          _id: grade._id,            // ID de la calificación
          userId: grade.userId,      // ID del usuario
          subjectId: grade.subjectId, // ID de la materia
          topicId: grade.topicId,    // ID del tema
          subtopicId: subTopic.subTopicId, // ID del subtema
          grade: subTopic.grade      // Calificación del subtema
        };

        // Agregar el objeto a la lista de datos
        data.push(gradeData);
      });
    });

    return data;
  }
 
  async findByUserAndTopic(userId: string, topicId: Types.ObjectId): Promise<Grade[]> {
    return this.gradeModel.find({ userId: userId, topicId: topicId }).exec();
  }


  filterGradesBelowThreshold(grades: GradeDocument[]) {
    return grades.filter(grade => grade.totalGrade < 10);
  }

  filterSubtopicGradesBelowThreshold(grades: GradeDocument[], maxScore: number) {
    return grades.filter(grade => {
      return grade.subTopics.some(subTopic => subTopic.grade < maxScore);
    });
  }
  // En tu archivo: grade.service.ts
// En tu archivo: grade.service.ts

async createOrUpdate(createGradeDto: CreateGradeDto): Promise<any> {
    const { userId, subjectId, topicId, subTopics,totalRecoveryGrade } = createGradeDto;

    // 1. Validamos que el front-end haya enviado calificaciones para procesar.
    if (!subTopics || subTopics.length === 0) {
        // Dependiendo de la lógica de negocio, puedes devolver un mensaje o un error.
        return { message: "No se proporcionaron calificaciones para procesar." };
    }

    // 2. Calculamos la calificación total.
    // IMPORTANTE: Estoy asumiendo que es la SUMA de las notas.
    // Si es un promedio u otro cálculo, debes ajustar esta línea.
    const totalGrade = subTopics.reduce((sum, current) => sum + current.grade, 0);

    // 3. El filtro para encontrar el documento de calificación principal.
    // Es único por la combinación de usuario y tema.
    const filter = {
        userId: userId,
        topicId: topicId,
    };

    // 4. El objeto completo que se guardará.
    // Esto sobreescribirá el documento existente con los datos más recientes.
    const updatePayload = {
        userId,
        subjectId,
        topicId,
        subTopics, // Reemplazamos el array completo con el que llega del front-end.
        totalGrade,
        totalRecoveryGrade, // Agregamos el campo de recuperación si se envía.
    };

    // 5. Las opciones para la operación de "upsert".
    const options = {
        upsert: true, // Crea el documento si no lo encuentra.
        new: true,    // Devuelve el documento después de la actualización/creación.
        setDefaultsOnInsert: true,
    };

    try {
        // 6. Ejecutamos la operación. Mongoose se encarga de todo.
        const result = await this.gradeModel.findOneAndUpdate(filter, updatePayload, options).exec();
        
        return {
            message: `Calificaciones para el usuario ${userId} procesadas exitosamente.`,
            data: result,
        };
    } catch (error) {
        throw new Error(`Error al procesar las calificaciones: ${error.message}`);
    }
}
async findRecoveryGradesByTopicId(topicId: Types.ObjectId): Promise<any[]> {
  // Buscar todas las calificaciones relacionadas con el topicId
  const grades = await this.gradeModel.find({ topicId: topicId.toString() }).exec();

  // Extraer solo las calificaciones de recuperación (totalRecoveryGrade)
  const recoveryGrades = grades.map(grade => ({
    userId: grade.userId,
    totalRecoveryGrade: grade.totalRecoveryGrade || null  // Solo devolver el totalRecoveryGrade
  }));

  return recoveryGrades;
}

}
