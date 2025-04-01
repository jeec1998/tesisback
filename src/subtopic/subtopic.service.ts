import { Injectable } from '@nestjs/common';
import { CreateSubtopicDto } from './dto/create-subtopic.dto';
import { UpdateSubtopicDto } from './dto/update-subtopic.dto';

@Injectable()
export class SubtopicService {
  create(createSubtopicDto: CreateSubtopicDto) {
    return 'This action adds a new subtopic';
  }

  findAll() {
    return `This action returns all subtopic`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subtopic`;
  }

  update(id: number, updateSubtopicDto: UpdateSubtopicDto) {
    return `This action updates a #${id} subtopic`;
  }

  remove(id: number) {
    return `This action removes a #${id} subtopic`;
  }
}
