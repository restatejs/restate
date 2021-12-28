export type IHTTPClienteRequestBody =
  | Record<string, unknown>
  | Record<string, unknown>[];

export interface IHTTPClient {
  get<R>(url: string): Promise<R>;
  post<R>(url: string, body: IHTTPClienteRequestBody): Promise<R>;
  put<R>(url: string, body: IHTTPClienteRequestBody): Promise<R>;
  delete<R>(url: string): Promise<R>;
}
