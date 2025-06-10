export interface RatingDto {
  average: number | null;
}

export interface ImageDto {
  medium: string;
  original: string;
}

export interface SelfLinkDto {
  href: string;
}

export interface ShowLinkDto extends SelfLinkDto {
  name: string;
}

export interface EpisodeLinksDto {
  self: SelfLinkDto;
  show: ShowLinkDto;
}

export interface EpisodeDto {
  id: number;
  url: string;
  name: string;
  season: number;
  number: number;
  type: string; // 'regular', 'special', itp.
  airdate: string; // ISO YYYY-MM-DD
  airtime: string | null;
  airstamp: string; // ISO z offsetem
  runtime: number; // minuty
  rating: RatingDto;
  image: ImageDto | null;
  summary: string | null; // HTML
  _links: EpisodeLinksDto;
}
