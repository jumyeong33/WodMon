import { users } from '@prisma/client';
import { UUID } from 'src/utils/UUID';

export class User {
  id: number;
  uuid: UUID;
  name: string;
  email: string;
  createdAt: Date;
  updatedAt?: Date | null;
  archivedAt?: Date | null;

  public static FromRow(row: users): User {
    const user = new User();
    user.id = row.id;
    user.uuid = UUID.FromStr(row.user_uuid);
    user.name = row.name;
    user.email = row.email;
    user.createdAt = row.created_at;
    user.updatedAt = row.updated_at;
    user.archivedAt = row.archived_at;

    return user;
  }

  public serialize() {
    return {
      id: this.id,
      user_uuid: this.uuid.String(),
      name: this.name,
      email: this.email,
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
