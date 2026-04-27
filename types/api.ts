export type ApiError = {
  message: string;
  statusCode: number;
  code?: string;
  details?: Record<string, string[]>;
};

export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  nextCursor?: string | null;
};

export type ApiListParams = {
  page?: number;
  pageSize?: number;
  cursor?: string;
  search?: string;
};
