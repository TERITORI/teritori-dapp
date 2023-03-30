export type TenorResponse<T> = {
  results: T;
  next: string;
  error: TenorReponseError;
};

interface TenorReponseError {
  code: number;
  message: string;
  status: string;
  details: Detail[];
}

interface Detail {
  "@type": string;
  reason: string;
  domain: string;
  metadata: Metadata;
}

interface Metadata {
  service: string;
}

export interface TenorItemType {
  id: string;
  title: string;
  media_formats: { [key: string]: TenorMediaFormat };
  created: number;
  content_description: string;
  itemurl: string;
  url: string;
  tags: string[];
  flags: any[];
  hasaudio: boolean;
}

interface TenorMediaFormat {
  url: string;
  duration: number;
  preview: string;
  dims: number[];
  size: number;
}

export type TenorFetchResponse = {
  list: TenorItemType[];
  after: string;
} | null;
