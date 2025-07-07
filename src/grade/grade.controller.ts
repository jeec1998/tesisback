import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { GradeService } from './grade.service';
import { Types } from 'mongoose';
import { CreateGradeDto } from './dto/create-grade.dto';
import { UserDefinedMessageSubscriptionInstance } from 'twilio/lib/rest/api/v2010/account/call/userDefinedMessageSubscription';
import { AuthGuard } from '@nestjs/passport';

@Controller('grades')
export class GradeController {
  constructor(private readonly gradeService: GradeService) {}

  @Get()
  findAll() {
    return this.gradeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.gradeService.findOne(new Types.ObjectId(id));
  }
  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    try {
      return this.gradeService.findByUserId(userId); // sin ObjectId
    } catch (error) {
      return { error: error.message };
    }
  }
  @Get('user/:userId/subject/:subjectId')
  findByUserAndSubject(
    @Param('userId') userId: string,
    @Param('subjectId') subjectId: string,
  ) {
    try {
      // Asumimos que subjectId también es un ObjectId de MongoDB.
      // Si no lo fuera, simplemente puedes pasar el string directamente.
      const subjectObjectId = new Types.ObjectId(subjectId);

      // Debes crear el método 'findByUserAndSubject' en tu GradeService.
      return this.gradeService.findByUserAndSubject(userId, subjectObjectId);
    } catch (error) {
      // Captura errores, por ejemplo, si el formato de subjectId no es válido.
      return { error: `Ocurrió un error al procesar la solicitud: ${error.message}` };
    }
  }
   // --- Nuevo método para obtener por userId y topicId ---
  @Get('user/:userId/topic/:topicId')
  async findByUserAndTopic(
    @Param('userId') userId: string,
    @Param('topicId') topicId: string,
  ) {
    try {
      // Asegúrate de que topicId se convierte a ObjectId si es necesario
      const topicObjectId = new Types.ObjectId(topicId);
      return this.gradeService.findByUserAndTopic(userId, topicObjectId);
    } catch (error) {
      return { error: `Ocurrió un error al procesar la solicitud: ${error.message}` };
    }
  }
  // --- Fin del nuevo método ---

@UseGuards(AuthGuard('jwt'))
  @Post()
  createOrUpdateGrades(@Body() createGradeDto: CreateGradeDto) {
    // La lógica de 'upsert' se delega al servicio.
    // El servicio ahora se llamará 'createOrUpdate' para mayor claridad.
    return this.gradeService.createOrUpdate(createGradeDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGradeDto: any) {
    return this.gradeService.update(new Types.ObjectId(id), updateGradeDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.gradeService.delete(new Types.ObjectId(id));
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('topic/:topicId')
  async findByTopic(@Param('topicId') topicId: string) {
    const gradesByTopic = await this.gradeService.findByTopicId(new Types.ObjectId(topicId));
    return this.gradeService.buildListGroupedBySubtopics(gradesByTopic);
  }
  @UseGuards(AuthGuard('jwt'))
@Get('topic/:topicId/recovery')
async findRecoveryGrades(@Param('topicId') topicId: string) {
  try {
    const recoveryGrades = await this.gradeService.findRecoveryGradesByTopicId(new Types.ObjectId(topicId));
    return recoveryGrades;
  } catch (error) {
    return { error: `Ocurrió un error al procesar la solicitud: ${error.message}` };
  }
}

}
