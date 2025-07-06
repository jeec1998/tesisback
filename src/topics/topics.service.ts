import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Topic, TopicDocument } from './entities/topic.entity';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';
import { Types } from 'mongoose';

@Injectable()
export class TopicsService {
  constructor(
    @InjectModel(Topic.name)
    private readonly topicModel: Model<TopicDocument>,
  ) {}

  async create(createTopicDto: CreateTopicDto) {
    if (createTopicDto.subtopics && createTopicDto.subtopics.length > 0) {
      createTopicDto.subtopics = createTopicDto.subtopics.map((subtopic) => {
        if (!subtopic._id) {
          subtopic._id = new Types.ObjectId().toHexString();
        }
        return subtopic;
      });
    }
  
    const createdTopic = new this.topicModel(createTopicDto);
    return createdTopic.save();
  }
  

  async findByMateria(subjectId: string): Promise<Topic[]> {
    return this.topicModel.find({ subject: subjectId }).exec();
  }

  async findAll(): Promise<Topic[]> {
    return this.topicModel.find().populate('subject').exec();
  }

  async findOne(id: string): Promise<TopicDocument> {
    const topic = await this.topicModel.findById(id).populate('subject');
    if (!topic) {
      throw new NotFoundException('Tema no encontrado');
    }
    return topic;
  }

  async update(id: string, updateTopicDto: UpdateTopicDto): Promise<Topic> {
    // Primero, recupera el tema existente para comparar los subtemas
    const existingTopic = await this.topicModel.findById(id);

    if (!existingTopic) {
      throw new NotFoundException('Tema no encontrado');
    }

    // Mapear los _id existentes para una búsqueda rápida, asegurándose de convertirlos a string si no lo son
    const existingSubtopicIds = new Set(
      existingTopic.subtopics.map((sub) =>
        sub._id ? sub._id.toString() : null // Usar .toString() para ObjectId, si es null o undefined, no agregarlo
      ).filter(Boolean) // Elimina los nulls o undefineds
    );

    if (updateTopicDto.subtopics && updateTopicDto.subtopics.length > 0) {
      updateTopicDto.subtopics = updateTopicDto.subtopics.map((newSubtopic) => {
        // Convertir el _id del nuevo subtema a string para la comparación, si existe
        const newSubtopicId = newSubtopic._id ? newSubtopic._id.toString() : null;

        // Si el subtema no tiene un _id, o si tiene uno pero no existe en el tema original,
        // le asignamos uno nuevo.
        if (!newSubtopicId || !existingSubtopicIds.has(newSubtopicId)) {
          newSubtopic._id = new Types.ObjectId().toHexString();
        }
        return newSubtopic;
      });
    }

    const topic = await this.topicModel.findByIdAndUpdate(id, updateTopicDto, {
      new: true,
      // `overwrite: true` podría reemplazar completamente el array de subtemas.
      // Si quieres un merge, la lógica manual es mejor.
      // Aquí, se reemplazará el array `subtopics` por el que viene en `updateTopicDto`.
    }).populate('subject');

    if (!topic) {
      throw new NotFoundException('Tema no encontrado');
    }

    return topic;
  }
  async remove(id: string): Promise<Topic> {
    const topic = await this.topicModel.findByIdAndDelete(id).populate('subject');

    if (!topic) {
      throw new NotFoundException('Tema no encontrado');
    }

    return topic;
  }
}

