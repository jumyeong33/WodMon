import { BadRequestException, Injectable } from '@nestjs/common';
import { wods } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { UUID } from 'src/utils/UUID';
import { CreateWodDto } from './dto/createWod';
import { Wod } from './entities/wod.entity';

@Injectable()
export class WodsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UsersService,
  ) {}

  async create(userUUID: UUID, dto: CreateWodDto): Promise<UUID> {
    await this.userService.validateWhitelist(userUUID);

    const wodUUID = UUID.New();
    await this.prismaService.$queryRaw`
      INSERT INTO wods(
        wod_uuid,
        user_uuid,
        title,
        description
      )
      VALUES(
        ${wodUUID.String()},
        ${userUUID.String()},
        ${dto.title},
        ${dto.description}
      )`;

    return wodUUID;
  }

  async mustGet(wodUUID: UUID): Promise<Wod> {
    const wod: [wods] = await this.prismaService
      .$queryRaw`SELECT * FROM wods WHERE wod_uuid = ${wodUUID.String()}`;
    if (wod.length < 1) {
      throw new BadRequestException('The wod does not exist');
    }
    return Wod.FromRow(wod[0]);
  }
}
