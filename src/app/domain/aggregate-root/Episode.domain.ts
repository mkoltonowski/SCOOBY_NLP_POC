import { AggregateRoot } from '@nestjs/cqrs';

export class Episode extends AggregateRoot {
  protected constructor(
    private name: string,
    private description: string,
  ) {
    super();
  }

  public static create(name: string, description: string): Episode {
    return new Episode(name, description);
  }
}
