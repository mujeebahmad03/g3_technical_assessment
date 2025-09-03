export interface Between {
  min: number;
  max: number;
}

export interface FilterOperations<T = string | number | boolean | Date> {
  eq?: T;
  neq?: T;
  contains?: string; // for text fields
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
  path?: string[]; // instead of any[]
  some?: Record<string, unknown>; // avoid `any`, narrow to unknown
  every?: Record<string, unknown>;
  none?: Record<string, unknown>;
  is?: Record<string, unknown>;
  isSet?: boolean;
}

export interface QueryOptions<
  TFilters extends Record<string, FilterOperations> = Record<
    string,
    FilterOperations
  >,
> {
  page?: number;
  limit?: number;
  searchKey?: string;
  filters?: TFilters;
  sort?: string;
}
