import type { Axios, Method } from "axios";

import type { Load } from "../utils/load";
import { CoreModel } from "./CoreModel";

export type AfterRequest<D = unknown> = (data: D) => Promise<void> | void;

export interface HTTPModelOptions {
  resourceName: string;
  axios: Axios;
  afterRequest?: AfterRequest;
}

export interface RequestOptions<D = unknown> {
  query?: Record<string, string>;
  method: Method;
  data?: any;
  afterRequest?: AfterRequest<D>;
}

export declare class HTTPModel<RI> extends CoreModel<RI> {
  public readonly $axios: Axios;

  protected $afterRequest?: AfterRequest;

  constructor({ resourceName, axios, afterRequest }: HTTPModelOptions);

  public request<ReturneData = undefined, AfterRequestData = unknown>(
    url: string,
    options: RequestOptions<AfterRequestData>,
    returnedData?: ReturneData
  ): Load<ReturneData>;
}
