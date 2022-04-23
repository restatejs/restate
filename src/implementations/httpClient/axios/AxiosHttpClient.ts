import type { IHTTPClient, IHTTPClienteRequestBody } from "types";

import type { Axios } from "axios";

class AxiosHTTPClient implements IHTTPClient {
  constructor(private axios: Axios) {}

  async get<R>(url: string): Promise<R> {
    const response = await this.axios.get<R>(url);

    return response.data;
  }

  async post<R>(url: string, body: IHTTPClienteRequestBody): Promise<R> {
    const response = await this.axios.post<R>(url, body);

    return response.data;
  }

  async put(url: string, body: IHTTPClienteRequestBody): Promise<void> {
    await this.axios.put(url, body);
  }

  async delete(url: string): Promise<void> {
    await this.axios.delete(url);
  }
}

export { AxiosHTTPClient };
