import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UUID } from 'src/utils/UUID';
import { reply, replyErr, replyOk } from 'src/utils/ReplyHelper';
import { Tag } from './entities/tag.entity';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagsService: TagsService) {}

  @Post()
  async create(@Body() createTagDto: CreateTagDto): Promise<reply> {
    let tagUUID: UUID;
    try {
      tagUUID = await this.tagsService.create(createTagDto);
    } catch (err) {
      return replyErr(err);
    }

    return replyOk(tagUUID);
  }

  @Get()
  async findAll(): Promise<reply> {
    let tags: Tag[];
    try {
      tags = await this.tagsService.findAll();
    } catch (err) {
      return replyErr(err);
    }

    return replyOk(tags.map((tag) => tag.serialize()));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tagsService.findOne(+id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tagsService.remove(+id);
  }
}
