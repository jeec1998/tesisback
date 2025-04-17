import { Injectable, NotFoundException, BadRequestException,ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Topic, TopicDocument } from './entities/topic.entity';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';

@Injectable()
export class TopicsService {
  constructor(
    @InjectModel(Topic.name) private topicModel: Model<TopicDocument>,
  ) {}

  async create(createTopicDto: CreateTopicDto, userId: string): Promise<Topic> {
    const { name, curso } = createTopicDto;
  
    const existing = await this.topicModel.findOne({ name, curso }); // 👈 validamos ambos
  
    if (existing) {
      throw new BadRequestException(
        `Ya existe el tema "${name}" en el curso "${curso}".`
      );
    }
  
    const createdTopic = new this.topicModel({
      ...createTopicDto,
      createdBy: userId,
    });
  
    return createdTopic.save();
  }
  

  async findAll(): Promise<Topic[]> {
    return this.topicModel.find().populate('createdBy', 'name email').exec();
  }

  async findOne(id: string): Promise<Topic> {
    const topic = await this.topicModel.findById(id);
    if (!topic) {
      throw new NotFoundException('Tema no encontrado');
    }
    return topic;
  }
  

  async update(id: string, updateTopicDto: UpdateTopicDto, userId: string): Promise<Topic> {
    const topic = await this.topicModel.findById(id);
  
    if (!topic) {
      throw new NotFoundException('Tema no encontrado');
    }
  
    // 🔒 Asegura que el usuario autenticado sea el creador
    if (topic.createdBy.toString() !== userId) {
      throw new ForbiddenException('No tienes permisos para actualizar este tema');
    }
  
    if (updateTopicDto.name !== undefined) topic.name = updateTopicDto.name;
    if (updateTopicDto.curso !== undefined) topic.curso = updateTopicDto.curso;
  
    return topic.save();
  }
  // Eliminar un tema  
  
  async findByCreatedBy(userId: string): Promise<Topic[]> {
    return this.topicModel.find({ createdBy: userId }).exec();
  }
  
  async remove(id: string, userId: string): Promise<Topic | null> {
    const topic = await this.topicModel.findById(id);
    if (!topic) {
      throw new NotFoundException('Tema no encontrado');
    }
  
    if (topic.createdBy.toString() !== userId) {
      throw new ForbiddenException('No tienes permisos para eliminar este tema');
    }
  
    return this.topicModel.findByIdAndDelete(id); // <- devuelve Topic | null
  }
  
  
}
