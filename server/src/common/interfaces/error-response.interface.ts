export interface ErrorResponse {
  isSuccessful: boolean;
  statusCode: number;
  message: string | string[];
  error: string;
  timestamp: string;
  path?: string;
}
