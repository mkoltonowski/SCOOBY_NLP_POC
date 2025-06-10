import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { FetchSeriesQuery } from '../impl';
import { ConfigService } from '@nestjs/config';
import { NotFoundException } from '@nestjs/common';
import { EpisodeDto } from '../../../dtos/episode.dto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { basePath } from '../../../../../common/util/path';

@QueryHandler(FetchSeriesQuery)
export class FetchSeriesHandler implements IQueryHandler<FetchSeriesQuery> {
  constructor(private readonly configService: ConfigService) {}

  async execute(): Promise<any> {
    const movie = this.configService.get<{ id: string }>('movie');

    console.log(movie);
    const result = await fetch(
      `https://api.tvmaze.com/shows/${movie.id}/episodes`,
    );

    const parsedEpisodes = await result.json();

    if (!this.isEpisode(parsedEpisodes)) {
      throw new NotFoundException(`Could not find season`);
    }

    const episodes = [];

    parsedEpisodes.forEach((episode) => {
      const embeddingData = {
        id: episode.id,
        name: episode.name,
        season: episode.season,
        number: episode.number,
        type: episode.type,
        airdate: episode.airdate,
        rating: episode.rating.average.toString(),
        summary: episode.summary,
      };

      console.log(embeddingData);

      episodes.push(embeddingData);
    });

    await this.saveDocuments(JSON.stringify(episodes, null, episodes.length));

    return;
  }

  private isEpisode = (season: any): season is EpisodeDto[] => {
    return !!season && season.length > 0 && !!season[0].url;
  };

  private saveDocuments = async (data: string) => {
    await fs.writeFile(
      path.join(basePath, '/docs', 'test.json'),
      data,
      { flag: 'w', encoding: 'utf8' },
      (err) => {
        if (err) throw err;

        console.log(path.join(basePath, '/docs', 'test.json'));
      },
    );
  };

  private createEmbedding = (key: string) => {};
}
