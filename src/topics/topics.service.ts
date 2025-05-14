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
    const topic = await this.topicModel.findByIdAndUpdate(id, updateTopicDto, {
      new: true,
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

