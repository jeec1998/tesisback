import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subject, SubjectDocument } from './entities/subject.entity';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(
    @InjectModel(Subject.name) private subjectModel: Model<SubjectDocument>,
  ) {}

  async create(createSubjectDto: CreateSubjectDto): Promise<Subject> {
    const existing = await this.subjectModel.findOne({ name: createSubjectDto.name });
    if (existing) {
      throw new Error(`La materia con el nombre "${createSubjectDto.name}" ya existe.`);
    }
  
    const createdSubject = new this.subjectModel(createSubjectDto);
    return createdSubject.save();
  }
  

  async findAll(): Promise<Subject[]> {
    return this.subjectModel.find().exec();
  }

  async findOne(id: string): Promise<Subject> {
    const subject = await this.subjectModel.findById(id).exec();
    if (!subject) {
      throw new NotFoundException(`Subject with id ${id} not found`);
    }
    return subject;
  }

  async update(id: string, updateSubjectDto: UpdateSubjectDto): Promise<Subject> {
    const updatedSubject = await this.subjectModel.findByIdAndUpdate(id, updateSubjectDto, {
      new: true,
      runValidators: true,
    }).exec();

    if (!updatedSubject) {
      throw new NotFoundException(`Subject with id ${id} not found`);
    }

    return updatedSubject;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.subjectModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Subject with id ${id} not found`);
    }
    return { deleted: true };
  }
}
