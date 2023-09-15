import { BadRequestException, Injectable } from '@nestjs/common';
import { tags, wods } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { Tag } from 'src/tags/entities/tag.entity';
import { UsersService } from 'src/users/users.service';
import { UUID } from 'src/utils/UUID';
import { CreateWodDto } from './dto/createWod';
import { Wod, WodTags } from './entities/wod.entity';

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

  async countWods(): Promise<any> {
    const count = await this.prismaService
      .$queryRaw`SELECT COUNT(*) as count FROM wods`;
    return count[0];
  }
  async getAll(): Promise<any> {
    const wods: [wods] = await this.prismaService
      .$queryRaw`SELECT * FROM wods WHERE archived_at IS NULL`;
    return Wod.FromRows(wods);
  }

  async tagAdd(tagUUID: UUID, wodUUID: UUID): Promise<any> {
    const checkWod: [wods] = await this.prismaService
      .$queryRaw`SELECT wod_uuid FROM wods WHERE wod_uuid=${wodUUID.String()}`;
    if (checkWod.length < 1) {
      throw new BadRequestException('The wod does not exist');
    }
    const checkTag: [tags] = await this.prismaService
      .$queryRaw`SELECT tag_uuid FROM tags WHERE tag_uuid=${tagUUID.String()}`;
    if (checkTag.length < 1) {
      throw new BadRequestException('The tag does not exist');
    }
    const existTag: [any] = await this.prismaService
      .$queryRaw`SELECT * FROM wod_tag WHERE wod_uuid = ${wodUUID.String()} AND tag_uuid = ${tagUUID.String()}`;
    if (existTag.length > 0) {
      throw new BadRequestException('This Tag is already added at Wod');
    }
    const isOverTags: [any] = await this.prismaService
      .$queryRaw`SELECT COUNT(*) AS n FROM wod_tag WHERE wod_uuid = ${wodUUID.String()}`;
    if (isOverTags[0].n >= 3) {
      throw new BadRequestException('The Wod can have 3 tags');
    }
    await this.prismaService.$executeRaw`
    INSERT INTO wod_tag(tag_uuid, wod_uuid) VALUES(${tagUUID.String()}, ${wodUUID.String()})`;
  }

  async listWithTags(): Promise<any> {
    const rows: [any] = await this.prismaService.$queryRaw`
    SELECT 
      w.id as id,
      w.wod_uuid as wod_uuid,
      w.user_uuid as user_uuid,
      w.title as title,
      w.description as description,
      w.created_at as created_at,
      w.updated_at as updated_at,
      w.archived_at as archived_at,

      t.tag_uuid as tag_uuid,
      t.tag_slug as tag_slug,
      t.created_at as tag_created_at
    FROM wods w
    LEFT JOIN wod_tag wt ON wt.wod_uuid=w.wod_uuid
    LEFT JOIN tags t ON wt.tag_uuid=t.tag_uuid
    `;
    const wods = {};
    for (const row of rows) {
      // eslint-disable-next-line prefer-const
      let wodTag = null;
      if (wods.hasOwnProperty(row.wod_uuid)) {
        wodTag = wods[row.wod_uuid];
      } else {
        wodTag = new WodTags();
        wodTag.oneWod = Wod.FromRow(row);
        wodTag.tags = [];
      }
      if (row.tag_uuid !== null) {
        wodTag.tags.push(Tag.FromRow(row));
      }
      wods[row.wod_uuid] = wodTag;
    }

    return Object.values(wods);
  }

  async getAllPaged(limit: number, offset: number): Promise<any> {
    const wods: [wods] = await this.prismaService
      .$queryRaw`SELECT * FROM wods WHERE archived_at IS NULL LIMIT ${limit} OFFSET ${offset}`;
    return Wod.FromRows(wods);
  }

  async listByTag(tagUUIDs: [UUID]): Promise<any> {
    let stmt = '';
    let count: number;
    for (const [index, tagUUID] of tagUUIDs.entries()) {
      if (index === 0) {
        stmt = `\'${tagUUID.String()}\'`;
        count = 1;
        continue;
      }
      stmt = stmt + `, \'${tagUUID.String()}\'`;
      count = count + 1;
    }
    const query = `
    SELECT 
      w.id as id,
      w.wod_uuid as wod_uuid,
      w.user_uuid as user_uuid,
      w.title as title, 
      w.description as description,
      w.created_at as created_at,
      w.updated_at as updated_at,
      w.archived_at as archived_at,

      t.tag_uuid as tag_uuid,
      t.tag_slug as tag_slug,
      t.created_at as tag_created_at
    FROM wods w
    RIGHT OUTER JOIN (
      SELECT 
        wod_uuid
      FROM wod_tag 
      WHERE tag_uuid IN (${stmt})
      GROUP BY wod_uuid 
      HAVING COUNT(tag_uuid) >= ${count}
    ) twt ON twt.wod_uuid= w.wod_uuid
    JOIN wod_tag wt ON twt.wod_uuid = wt.wod_uuid 
    JOIN tags t ON t.tag_uuid = wt.tag_uuid
    ;`;

    const rows: [any] = await this.prismaService.$queryRawUnsafe(query);
    const wods = {};
    for (const row of rows) {
      // eslint-disable-next-line prefer-const
      let wodTag = null;
      if (wods.hasOwnProperty(row.wod_uuid)) {
        wodTag = wods[row.wod_uuid];
      } else {
        wodTag = new WodTags();
        wodTag.oneWod = Wod.FromRow(row);
        wodTag.tags = [];
      }

      wodTag.tags.push(Tag.FromRow(row));
      wods[row.wod_uuid] = wodTag;
    }

    return Object.values(wods);
  }
}
