import type {
  AfterRequest,
  HTTPModelOptions,
  RequestOptions,
} from "types/models/HTTPModel";
import type { Load } from "types/utils/load";

import type { Axios } from "axios";

import { load } from "@/utils/load";

import { CoreModel } from "./CoreModel";

class HTTPModel<RI extends object> extends CoreModel<RI> {
  public readonly $axios: Axios;

  protected $afterRequest?: AfterRequest;

  constructor({ resourceName, axios, afterRequest }: HTTPModelOptions) {
    super(resourceName);

    this.$axios = axios;
    this.$afterRequest = afterRequest;
  }

  public request<ReturneData = undefined, AfterRequestData = unknown>(
    url: string,
    options: RequestOptions<AfterRequestData>,
    returnedData?: ReturneData
  ): Load<ReturneData> {
    return load(async () => {
      const { data } = await this.$axios.request({
        url,
        method: options?.method,
        params: options?.query,
        data: options?.data,
      });

      if (this.$afterRequest) {
        await this.$afterRequest(data);
      }

      if (options?.afterRequest) {
        await options.afterRequest(data);
      }
    }, returnedData);
  }
}

export { HTTPModel };
