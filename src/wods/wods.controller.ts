import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetCurrentUserUUID } from 'src/common/decorators';
import { AtGuard } from 'src/common/guards';
import { reply, replyErr, replyOk } from 'src/utils/ReplyHelper';
import { UUID } from 'src/utils/UUID';
import { CreateWodDto } from './dto/createWod';
import { Wod, WodTags } from './entities/wod.entity';
import { WodsService } from './wods.service';

@Controller('wods')
export class WodsController {
  constructor(private readonly wodsService: WodsService) {}

  @UseGuards(AtGuard)
  @Post()
  async create(
    @Body() createWodDto: CreateWodDto,
    @GetCurrentUserUUID() userUUID: UUID,
  ): Promise<any> {
    let wodUUID: UUID;
    try {
      wodUUID = await this.wodsService.create(userUUID, createWodDto);
    } catch (err) {
      return replyErr(err);
    }

    return replyOk(wodUUID);
  }

  @Get('paged?')
  async findAllPaged(
    @Query('limit') limit: number,
    @Query('offset') offset: number,
  ): Promise<any> {
    let wods: Wod[];

    try {
      wods = await this.wodsService.getAllPaged(limit, offset);
    } catch (err) {
      return replyErr(err);
    }
    return replyOk(wods.map((wod) => wod.serialize()));
  }

  @Get('count')
  async countWods(): Promise<any> {
    let count: any;
    try {
      count = await this.wodsService.countWods();
      count.count = Number(count.count);
    } catch (err) {
      return replyErr(err);
    }

    return replyOk(count);
  }
  @Get('list')
  async list(): Promise<reply> {
    const wods: [any] = await this.wodsService.listWithTags();

    return replyOk(wods.map((wod: WodTags) => wod.serialize()));
  }

  @Get(':uuid')
  async findOne(@Param('uuid') uuid: string) {
    let wod: Wod;
    const wodUUID = UUID.FromStr(uuid);

    try {
      wod = await this.wodsService.mustGet(wodUUID);
    } catch (err) {
      return replyErr(err);
    }

    return replyOk(wod.serialize());
  }

  @Get()
  async findAll(): Promise<reply> {
    let wods: Wod[];

    try {
      wods = await this.wodsService.getAll();
    } catch (err) {
      return replyErr(err);
    }
    return replyOk(wods.map((wod) => wod.serialize()));
  }

  @Post()
  async addTag(@Body() tagUUID: UUID, wodUUID: UUID): Promise<reply> {
    try {
      await this.wodsService.tagAdd(tagUUID, wodUUID);
    } catch (err) {
      return replyErr(err);
    }
    return replyOk();
  }

  @Get('list/tags')
  async findByTag(@Body('uuids') uuids: [string]): Promise<reply> {
    if (uuids.length < 1) {
      return replyOk();
    }

    let wods: WodTags[];
    let tagUUIDs: [UUID];
    for (const uuid of uuids) {
      if (tagUUIDs === undefined) {
        tagUUIDs = [UUID.FromStr(uuid)];
        continue;
      }
      tagUUIDs.push(UUID.FromStr(uuid));
    }
    try {
      wods = await this.wodsService.listByTag(tagUUIDs);
    } catch (err) {
      return replyErr(err);
    }

    return replyOk(wods.map((wod: WodTags) => wod.serialize()));
  }
}
