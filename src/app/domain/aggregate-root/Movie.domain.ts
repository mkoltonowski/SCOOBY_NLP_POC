import { AggregateRoot } from '@nestjs/cqrs';

export class Movie extends AggregateRoot {
  protected constructor(
    private name: string,
    private description: string,
  ) {
    super();
  }

  public static create(name: string, description: string): Movie {
    return new Movie(name, description);
  }
}
