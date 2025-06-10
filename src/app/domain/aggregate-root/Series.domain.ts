import { Movie } from './Movie.domain';
import { Episode } from './Episode.domain';

export class Series extends Movie {
  private episodes: Episode[];
  protected constructor(name: string, description: string) {
    super(name, description);
  }

  public addEpisodes(episodes: Episode[]) {
    this.episodes = episodes;
  }

  public getSeries(): Series {
    return this;
  }

  public getEpisodes(): Episode[] {
    return this.episodes;
  }
}
