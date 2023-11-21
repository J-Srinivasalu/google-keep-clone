export interface ISuccessResponse {
  message: string;
  data: never;
}

export interface IErrorResponse {
  error: string;
  message: string;
}
