export interface ApiResponse<T> {
  timeStamp: string;
  statusCode: number;
  message: string;
  data: T;
}
