import { Query } from '@nestjs/cqrs';

export class FetchSeriesQuery extends Query<any> {
  constructor() {
    super();
  }
}
