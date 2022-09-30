import { wods } from '@prisma/client';
import { Tag } from 'src/tags/entities/tag.entity';
import { UUID } from 'src/utils/UUID';
export class Wod {
  id: number;
  uuid: UUID;
  userUUID: UUID;
  title?: string;
  description: string;
  createdAt: Date;
  updatedAt?: Date | null;
  archivedAt?: Date | null;

  public static FromRow(row: wods): Wod {
    const wod = new Wod();
    wod.id = row.id;
    wod.uuid = UUID.FromStr(row.wod_uuid);
    wod.userUUID = UUID.FromStr(row.user_uuid);
    wod.title = row.title;
    wod.description = row.description;
    wod.createdAt = row.created_at;
    wod.updatedAt = row.updated_at;
    wod.archivedAt = row.archived_at;

    return wod;
  }

  public static FromRows(rows: [wods]): Wod[] {
    return rows.map((row) => this.FromRow(row));
  }

  public serialize() {
    return {
      id: this.id,
      wodUUID: this.uuid.String(),
      userUUID: this.userUUID.String(),
      title: this.title,
      description: this.description,
      createdAt: this.createdAt.toDateString(),
      updatedAt:
        this.updatedAt === null
          ? this.updatedAt
          : this.updatedAt.toDateString(),
      archivedAt:
        this.archivedAt === null
          ? this.archivedAt
          : this.archivedAt.toDateString(),
    };
  }
}

export class WodTags {
  public oneWod: Wod;
  public tags: [Tag];

  public serialize() {
    return {
      Wod: this.oneWod.serialize(),
      Tags: this.tags.map((tag) => tag.serialize()),
    };
  }
}
