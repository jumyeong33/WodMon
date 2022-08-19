import { hero_wod } from '@prisma/client';

export class HeroWod {
  id: number;
  title: string;
  description: string;
  history: string;
  createdAt: Date;

  public static FromRow(row: hero_wod): HeroWod {
    const heroWod = new HeroWod();

    heroWod.id = row.id;
    heroWod.title = row.title;
    heroWod.description = row.description;
    heroWod.history = row.history;
    heroWod.createdAt = row.created_at;

    return heroWod;
  }

  public static FromRows(rows: [hero_wod]): HeroWod[] {
    return rows.map((row) => this.FromRow(row));
  }

  public serialize() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      history: this.history,
      createdAt: this.createdAt.toDateString(),
    };
  }
}
