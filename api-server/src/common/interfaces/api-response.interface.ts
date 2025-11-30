export interface BaseApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}
