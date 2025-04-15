import { Injectable } from '@nestjs/common';
import { CreateSubTopicDto } from './dto/create-sub-topic.dto';
import { UpdateSubTopicDto } from './dto/update-sub-topic.dto';

@Injectable()
export class SubTopicsService {
  create(createSubTopicDto: CreateSubTopicDto) {
    return 'This action adds a new subTopic';
  }

  findAll() {
    return `This action returns all subTopics`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subTopic`;
  }

  update(id: number, updateSubTopicDto: UpdateSubTopicDto) {
    return `This action updates a #${id} subTopic`;
  }

  remove(id: number) {
    return `This action removes a #${id} subTopic`;
  }
}
