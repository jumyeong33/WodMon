import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GetCurrentUserUUID } from 'src/common/decorators';
import { AtGuard } from 'src/common/guards';
import { replyErr, replyOk } from 'src/utils/ReplyHelper';
import { UUID } from 'src/utils/UUID';
import { CreateWodDto } from './dto/createWod';
import { Wod } from './entities/wod.entity';
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
}
