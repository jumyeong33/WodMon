import { UUID } from 'src/utils/UUID';

export class User {
  id: number;
  uuid: UUID;
  name: string;
  email: string;
  createdAt: string;
  updatedAt?: string | null;
  archivedAt?: string | null;
}
