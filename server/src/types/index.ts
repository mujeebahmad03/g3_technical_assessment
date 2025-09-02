export interface Pagination {
  pageSize: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  hasMore: boolean;
  page: number;
}
