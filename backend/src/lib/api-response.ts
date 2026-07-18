// Every successful response follows this exact shape. When your frontend's
// axios interceptor and TanStack Query hooks always know what to expect,
// you stop writing one-off response parsers per endpoint.
export class ApiResponse<T> {
  success: true;
  message: string;
  data: T;

  constructor(message: string, data: T) {
    this.success = true;
    this.message = message;
    this.data = data;
  }
}
