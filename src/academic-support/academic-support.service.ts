import { Injectable } from '@nestjs/common';
import { CreateAcademicSupportDto } from './dto/create-academic-support.dto';
import { UpdateAcademicSupportDto } from './dto/update-academic-support.dto';
import { LangChainService } from 'src/shared/langchain/langchain-service';

@Injectable()
export class AcademicSupportService {
  constructor(
    private readonly langChainService: LangChainService,
  ) { }
  create(createAcademicSupportDto: CreateAcademicSupportDto) {
    return 'This action adds a new academicSupport';
  }

  findAll() {
    return `This action returns all academicSupport`;
  }

  findOne(id: number) {
    return `This action returns a #${id} academicSupport`;
  }

  update(id: number, updateAcademicSupportDto: UpdateAcademicSupportDto) {
    return `This action updates a #${id} academicSupport`;
  }

  remove(id: number) {
    return `This action removes a #${id} academicSupport`;
  }

  async generateByTopic(topicId: string) {
    // Debes llamar a todos los estudiantes que necesitan refuerzo academico del tema (todos los estudiantes que tienen menos de 9 puntos)
    // Iterar sobre los estudiantes y generar el refuerzo academico para cada uno
    // En cada iteracion debes llamar a la BD para obtener los datos necesarios
    // tema, subtemas, estilosDeAprendizaje, recursosDisponibles
    // En cada iteracion debes llamar a la IA para generar el refuerzo academico
    await this.generateWithIa(/* tema, subtemas, estilosDeAprendizaje, recursosDisponibles */);
    return 'Refuerzo académico generado';
  }

  async generateWithIa(/* tema, subtemas, estilosDeAprendizaje, recursosDisponibles */) {
    const prompt = this.buildPrompt();
    const response = await this.langChainService.generate(prompt); // Esta respuesta viene en formato JSON
    const parsedResponse = JSON.parse(response); // Parsear la respuesta JSON
    // Aquí puedes guardar la respuesta en la base de datos
    // Puedes enviar la respuesta al estudiante por correo electrónico o por otro medio
    // Puedes enviar la respuesta al profesor por correo electrónico o por otro medio
    return parsedResponse; // Deberías responder con la respuesta generada por la IA
  }


  buildPrompt(/* tema, subtemas, estilosDeAprendizaje, recursosDisponibles */): string {
    const subtemas = [
      {
        titulo: 'Funciones Lineales',
        descripcion: 'Introducción a las funciones lineales, representación gráfica y su interpretación en situaciones cotidianas.',
        nota: 1.5,
        notaMaxima: 3,
      },
      {
        titulo: 'Inecuaciones de primer grado',
        descripcion: 'Resolución de inecuaciones de primer grado y su representación en la recta numérica.',
        nota: 1,
        notaMaxima: 3,
      },
      {
        titulo: 'Sistema de ecuaciones lineales',
        descripcion: 'Métodos de resolución de sistemas de dos ecuaciones lineales con dos incógnitas: método gráfico, sustitución y reducción.',
        nota: 2,
        notaMaxima: 4,
      },
    ];

    const tema = {
      materia: 'Matemáticas',
      titulo: 'Refuerzo de Álgebra',
      descripcion: 'Refuerzo de subtemas clave en Álgebra relacionados a funciones lineales, inecuaciones y sistemas de ecuaciones.',
    };

    const estilosDeAprendizaje = [
      'Activo',
      'Reflexivo',
    ];

    const recursosDisponibles = [
      {
        id: 'R1',
        titulo: 'Guía práctica de funciones lineales',
        tipo: 'PDF',
        descripcion: 'Documento que explica paso a paso cómo construir, representar y analizar funciones lineales, incluyendo ejemplos prácticos.',
        subtema: 'Funciones Lineales',
      },
      {
        id: 'R2',
        titulo: 'Video: Resolución de Inecuaciones',
        tipo: 'Video',
        descripcion: 'Clase grabada donde se resuelven inecuaciones de primer grado y se explican diferentes métodos de representación.',
        subtema: 'Inecuaciones de primer grado',
      },
      {
        id: 'R3',
        titulo: 'Podcast: Entendiendo sistemas de ecuaciones',
        tipo: 'Audio',
        descripcion: 'Podcast educativo que explica de manera sencilla cómo resolver sistemas de ecuaciones lineales mediante sustitución y reducción.',
        subtema: 'Sistema de ecuaciones lineales',
      },
      {
        id: 'R4',
        titulo: 'Infografía de funciones lineales',
        tipo: 'Imagen',
        descripcion: 'Infografía visual que resume las principales características de las funciones lineales y ejemplos de la vida diaria.',
        subtema: 'Funciones Lineales',
      },
      {
        id: 'R5',
        titulo: 'Artículo científico: Modelos lineales',
        tipo: 'Texto',
        descripcion: 'Artículo teórico avanzado sobre aplicaciones de modelos lineales en ciencias e ingeniería. (Más orientado a teóricos).',
        subtema: 'Funciones Lineales',
      },
      {
        id: 'R6',
        titulo: 'Aplicación interactiva: Resuelve sistemas',
        tipo: 'Interactivo',
        descripcion: 'Aplicación online que permite practicar la resolución de sistemas de ecuaciones de manera interactiva mediante sustitución y eliminación.',
        subtema: 'Sistema de ecuaciones lineales',
      },
      {
        id: 'R7',
        titulo: 'Documento de ejercicios resueltos de inecuaciones',
        tipo: 'PDF',
        descripcion: 'Ejercicios prácticos de inecuaciones de primer grado con resolución paso a paso.',
        subtema: 'Inecuaciones de primer grado',
      },
      {
        id: 'R8',
        titulo: 'Galería de gráficos de funciones lineales',
        tipo: 'Imagen',
        descripcion: 'Colección de imágenes de gráficas de funciones lineales con diferentes pendientes y ordenadas al origen.',
        subtema: 'Funciones Lineales',
      },
      {
        id: 'R9',
        titulo: 'Tutorial de lectura matemática avanzada',
        tipo: 'Texto',
        descripcion: 'Guía teórica enfocada en interpretación avanzada de expresiones algebraicas. (Orientado a teóricos).',
        subtema: 'Sistema de ecuaciones lineales',
      },
      {
        id: 'R10',
        titulo: 'Video: Sistemas de ecuaciones en situaciones reales',
        tipo: 'Video',
        descripcion: 'Video educativo que aplica sistemas de ecuaciones a problemas cotidianos como compras, mezclas de productos y planificación.',
        subtema: 'Sistema de ecuaciones lineales',
      },
      {
        id: 'R11',
        titulo: 'Simulador de resolución de inecuaciones',
        tipo: 'Interactivo',
        descripcion: 'Simulador online donde los estudiantes resuelven gráficamente inecuaciones moviendo los elementos en la recta numérica.',
        subtema: 'Inecuaciones de primer grado',
      },
      {
        id: 'R12',
        titulo: 'Audio: Consejos para estudiar matemáticas',
        tipo: 'Audio',
        descripcion: 'Podcast breve con consejos prácticos para mejorar el aprendizaje de matemáticas mediante métodos activos.',
        subtema: 'Funciones Lineales',
      },
      {
        id: 'R13',
        titulo: 'Ensayo: Historia del Álgebra',
        tipo: 'Texto',
        descripcion: 'Ensayo histórico que describe el origen y evolución del álgebra a lo largo de la historia.',
        subtema: 'Funciones Lineales',
      }
    ];


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
      7. Explicar brevemente el **análisis que realizaste** para seleccionar los recursos y diseñar la actividad.

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
            "subtema": "Subtema relacionado"
          }
          // Puede haber más recursos
        ],
        "actividad_de_refuerzo": {
          "descripcion_general": "Descripción general de la actividad enfocada en la creación del documento entregable.",
          "pasos": [
            "Paso 1: Acción específica que debe realizar el estudiante.",
            "Paso 2: Acción específica que debe realizar el estudiante.",
            "Paso 3: Acción específica que debe realizar el estudiante."
            // Puede haber más pasos
          ],
          "tipo_documento_entregable": "Tipo de documento que el estudiante debe crear y entregar (por ejemplo: resumen, ensayo breve, informe, esquema, presentación escrita).",
          "objetivo": "Objetivo educativo que se busca alcanzar con esta actividad."
        },
        "analisis_del_modelo": "Explicación breve del razonamiento seguido para seleccionar los recursos y diseñar la actividad de refuerzo orientada al documento entregable."
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
}
