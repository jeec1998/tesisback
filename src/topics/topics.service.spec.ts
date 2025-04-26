import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Topic, TopicDocument } from './entities/topic.entity';
import { CreateTopicDto } from './dto/create-topic.dto';
import { UpdateTopicDto } from './dto/update-topic.dto';

@Injectable()
export class TopicsService {
  constructor(
    @InjectModel(Topic.name) private topicModel: Model<TopicDocument>
  ) {}

  async create(createTopicDto: CreateTopicDto): Promise<Topic> {
    const topic = new this.topicModel(createTopicDto);
    return topic.save();
  }

  async findByMateria(materiaId: string): Promise<Topic[]> {
    return this.topicModel.find({ subject: materiaId }).exec();
  }

  async update(id: string, updateTopicDto: UpdateTopicDto): Promise<Topic> {
    const topic = await this.topicModel.findByIdAndUpdate(id, updateTopicDto, {
      new: true,
      runValidators: true,
    });
    if (!topic) throw new NotFoundException('Tema no encontrado');
    return topic;
  }

  async remove(id: string): Promise<Topic> {
    const topic = await this.topicModel.findByIdAndDelete(id);
    if (!topic) throw new NotFoundException('Tema no encontrado');
    return topic;
  }
}
