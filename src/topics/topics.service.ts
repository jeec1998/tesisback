import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
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

  async create(createTopicDto: CreateTopicDto): Promise<Topic> {
    const existing = await this.topicModel.findOne({ name: createTopicDto.name });
    if (existing) {
      throw new BadRequestException(`El tema con el nombre "${createTopicDto.name}" ya existe.`);
    }

    const createdTopic = new this.topicModel(createTopicDto);
    return createdTopic.save();
  }

  async findAll(): Promise<Topic[]> {
    return this.topicModel.find().exec();
  }

  async findOne(id: string): Promise<Topic> {
    const topic = await this.topicModel.findById(id).exec();
    if (!topic) {
      throw new NotFoundException(`Tema con id ${id} no encontrado`);
    }
    return topic;
  }

  async update(id: string, updateTopicDto: UpdateTopicDto): Promise<Topic> {
    const updatedTopic = await this.topicModel.findByIdAndUpdate(id, updateTopicDto, {
      new: true,
      runValidators: true,
    }).exec();

    if (!updatedTopic) {
      throw new NotFoundException(`Tema con id ${id} no encontrado`);
    }

    return updatedTopic;
  }

  async remove(id: string): Promise<{ deleted: boolean }> {
    const result = await this.topicModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Tema con id ${id} no encontrado`);
    }
    return { deleted: true };
  }
}
