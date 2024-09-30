import { PageMetadataDTO } from './page-meta.dto';

export class PaginatedDTO<T> {
  readonly data: T[];
  readonly meta: PageMetadataDTO;

  constructor(data: T[], page: number, limit: number, itemCount: number) {
    this.data = data;
    this.meta = new PageMetadataDTO(page, limit, itemCount);
  }
}
