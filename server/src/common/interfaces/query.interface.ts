export interface Between {
  min: number;
  max: number;
}

export interface FilterOperations {
  eq?: string | number | boolean | Date;
  neq?: string | number | boolean | Date;
  contains?: string;
  startsWith?: string;
  endsWith?: string;
  gt?: number | Date;
  gte?: number | Date;
  lt?: number | Date;
  lte?: number | Date;
  in?: any[];
  notIn?: any[];
  not?: boolean;
  between?: Between;
  isNull?: boolean;
  before?: Date;
  after?: Date;
  hasKey?: string;
  path?: any[];
  some?: Record<string, any>;
  every?: Record<string, any>;
  none?: Record<string, any>;
  is?: Record<string, any>;
  isSet?: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
}

export interface QueryOptions {
  page?: number;
  limit?: number;
  searchKey?: string;
  filters?: Record<string, FilterOperations>;
  sort?: string;
}
