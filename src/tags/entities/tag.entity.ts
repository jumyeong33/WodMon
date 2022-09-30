import { tags } from '@prisma/client';
import { UUID } from 'src/utils/UUID';

export class Tag {
  uuid: UUID;
  slug: string;
  createdAt: Date;

  public static FromRow(row: tags): Tag {
    const tag = new Tag();
    tag.uuid = UUID.FromStr(row.tag_uuid);
    tag.slug = row.tag_slug;
    tag.createdAt = row.created_at;

    return tag;
  }

  public static FromRows(rows: [tags]): Tag[] {
    return rows.map((row) => this.FromRow(row));
  }

  public serialize() {
    return {
      tagUUID: this.uuid.String(),
      slug: this.slug,
      createdAt: this.createdAt.toDateString(),
    };
  }
}
