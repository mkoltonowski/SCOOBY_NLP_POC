export interface CountryDto {
  name: string;
  code: string;
  timezone: string;
}

export interface NetworkDto {
  id: number;
  name: string;
  country: CountryDto;
  officialSite: string | null;
}

export interface SelfLinkDto {
  href: string;
}

export interface LinksDto {
  self: SelfLinkDto;
}

export interface SeasonDto {
  id: number;
  url: string;
  number: number;
  name: string | null;
  episodeOrder: number;
  premiereDate: string; // ISO YYYY-MM-DD
  endDate: string; // ISO YYYY-MM-DD
  network: NetworkDto | null;
  webChannel: unknown | null;
  image: unknown | null;
  summary: string | null;
  _links: LinksDto;
}
