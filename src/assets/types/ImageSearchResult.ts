import { NotRequired } from '@type/NotRequired';

export type ImageSearchResult = NotRequired<
  NotRequired<{
    src: string;
    alt?: string;
  }>[]
>;
