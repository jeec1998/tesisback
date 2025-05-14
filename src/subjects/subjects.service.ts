import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Subject, SubjectDocument } from './entities/subject.entity';
import { CreateSubjectDto } from './dto/create-subjects.dto';
import { UpdateSubjectDto } from './dto/update-subjects.dto';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel(Subject.name) private SubjectModel: Model<SubjectDocument>,
  ) { }

  async create(createSubjectDto: CreateSubjectDto, userId: Types.ObjectId): Promise<Subject> {
    const { name, curso } = createSubjectDto;

    const existing = await this.SubjectModel.findOne({ name, curso });
    if (existing) {
      throw new BadRequestException(
        `Ya existe el tema "${name}" en el curso "${curso}".`
      );
    }

    const createdSubject = new this.SubjectModel({
      ...createSubjectDto,
      createdBy: userId,
    });

    return createdSubject.save();
  }


  async findAll(): Promise<Subject[]> {
    return this.SubjectModel.find().populate('createdBy', 'name email').exec();
  }

  async findOne(id: string): Promise<SubjectDocument> {
    const Subject = await this.SubjectModel.findById(new Types.ObjectId(id));
    if (!Subject) {
      throw new NotFoundException('Tema no encontrado');
    }
    return Subject;
  }


  async update(id: string, updateSubjectDto: UpdateSubjectDto, userId: Types.ObjectId): Promise<Subject> {
    const Subject = await this.SubjectModel.findById(id);

    if (!Subject) {
      throw new NotFoundException('Tema no encontrado');
    }


    if (Subject.createdBy.toString() !== userId.toString()) {
      throw new ForbiddenException('No tienes permisos para actualizar este tema');
    }

    if (updateSubjectDto.name !== undefined) Subject.name = updateSubjectDto.name;
    if (updateSubjectDto.curso !== undefined) Subject.curso = updateSubjectDto.curso;

    return Subject.save();
  }


  async findByCreatedBy(userId: Types.ObjectId): Promise<Subject[]> {
    return this.SubjectModel.find({ createdBy: userId }).exec();
  }

  async remove(id: string, userId: Types.ObjectId): Promise<Subject | null> {
    const Subject = await this.SubjectModel.findById(id);
    if (!Subject) {
      throw new NotFoundException('Tema no encontrado');
    }

    if (Subject.createdBy.toString() !== userId.toString()) {
      throw new ForbiddenException('No tienes permisos para eliminar este tema');
    }

    return this.SubjectModel.findByIdAndDelete(id);
  }
  async updateAsAdmin(id: string, updateSubjectDto: UpdateSubjectDto) {
    const subject = await this.SubjectModel.findByIdAndUpdate(id, updateSubjectDto, { new: true });

    if (!subject) {
      throw new NotFoundException('Subject no encontrado');
    }

    return subject;
  }
  async removeAsAdmin(id: string): Promise<Subject> {
    const subject = await this.SubjectModel.findByIdAndDelete(id);

    if (!subject) {
      throw new NotFoundException('Materia no encontrada');
    }

    return subject;
  }

}
