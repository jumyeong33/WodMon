import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { tags } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UUID } from 'src/utils/UUID';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';

@Injectable()
export class TagsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createTagDto: CreateTagDto): Promise<UUID> {
    //TODO : check is there exist tag
    const existTag: [tags] = await this.prismaService
      .$queryRaw`SELECT tag_uuid FROM tags WHERE tag_slug = ${createTagDto.slug};`;

    if (existTag.length > 0) {
      throw new HttpException('Tag is already taken', HttpStatus.BAD_REQUEST);
    }
    const tagUUID = UUID.New();
    await this.prismaService.$transaction([
      this.prismaService.$executeRaw`
      INSERT INTO tags(
        tag_uuid, 
        tag_slug
      ) 
      VALUES(
        ${tagUUID.String()}, 
        ${createTagDto.slug}
      );`,
    ]);

    return tagUUID;
  }

  async findAll(): Promise<any> {
    const tags: [tags] = await this.prismaService
      .$queryRaw`SELECT * FROM tags;`;

    return Tag.FromRows(tags);
  }

  findOne(id: number) {
    return `This action returns a #${id} tag`;
  }

  update(id: number, updateTagDto: UpdateTagDto) {
    return `This action updates a #${id} tag`;
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
