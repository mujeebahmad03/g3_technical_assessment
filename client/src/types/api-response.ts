export interface ApiErrorResponse {
  isSuccessful: boolean;
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path?: string;
}

export interface ApiResponse<T> {
  isSuccessful: boolean;
  message: string;
  data: T;
}

export interface Meta {
  totalItems: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
  pageSize: number;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  meta: Meta;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: Meta;
}

export interface Between {
  min: number;
  max: number;
}

export interface FilterOperations<T = string | number | boolean | Date> {
  eq?: T;
  neq?: T;
  contains?: string;
  startsWith?: string;
  endsWith?: string;
  gt?: T;
  gte?: T;
  lt?: T;
  lte?: T;
  in?: T[];
  notIn?: T[];
  not?: boolean;
  between?: Between;
  isNull?: boolean;
  before?: Date;
  after?: Date;
  hasKey?: string;
  path?: string[];
  some?: Record<string, unknown>;
  every?: Record<string, unknown>;
  none?: Record<string, unknown>;
  is?: Record<string, unknown>;
  isSet?: boolean;
}

export interface QueryOptions<
  TFilters extends Record<string, FilterOperations> = Record<
    string,
    FilterOperations
  >
> {
  page?: number;
  limit?: number;
  searchKey?: string;
  filters?: TFilters;
  sort?: string;
}

export interface RequestParams {
  page?: number;
  limit?: number;
  searchKey?: string;
  filters?: Record<string, FilterOperations>;
  sort?: string;
}
