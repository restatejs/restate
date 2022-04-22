import { IHTTPClient, IHTTPClienteRequestBody } from "types";

import { Axios } from "axios";

export declare class AxiosHTTPClient implements IHTTPClient {
  private axios: Axios;

  constructor(axios: Axios);

  get<R>(url: string): Promise<R>;

  post<R>(url: string, body: IHTTPClienteRequestBody): Promise<R>;

  put<R>(url: string, body: IHTTPClienteRequestBody): Promise<R>;

  delete<R>(url: string): Promise<R>;
}
