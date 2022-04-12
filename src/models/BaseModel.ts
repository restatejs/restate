import {
  HTTPResponseCollection,
  HTTPResponseItem,
  IndexOptions,
  IPK,
  ShowOptions,
  StoreOptions,
  UpdateOptions,
  DestroyOptions,
} from "types";

import Restate from "..";

import { CoreModel } from "./CoreModel";

class BaseModel<RI> extends CoreModel<RI> {
  protected $pk = "id";

  constructor(public $resourceName: string, public $restate: Restate) {
    super($resourceName, $restate);
  }

  public async index(options?: IndexOptions<RI>): Promise<RI[]> {
    let url = `/${this.$resourceName}`;

    if (options?.query) {
      url += `?${new URLSearchParams(options.query)}`;
    }

    const response = await this.$httpClient.get<HTTPResponseCollection<RI>>(
      url
    );

    if (!options?.store) {
      const { data } = response;

      if (options?.merge !== true) {
        this.$resource.clear();
      }


      data.forEach((item: any) => this.$resource.set(item[this.$pk], item));
    } else {
      options.store(this.$resource, response);
    }

    return this.$resource.getAll();
  }

  public async show(
    id: IPK,
    options?: ShowOptions<RI>
  ): Promise<RI | undefined> {
    let url = `/${this.$resourceName}/${id}`;

    if (options?.query) {
      url += `?${new URLSearchParams(options.query)}`;
    }

    const response = await this.$httpClient.get<HTTPResponseItem<RI>>(url);

    if (!options?.store) {
      const { data } = response;

      this.$resource.set((data as any)[this.$pk], data);
    } else {
      options.store(this.$resource, response);
    }

    return this.$resource.get(id);
  }

  public async store(
    data: Record<string, Partial<RI>>,
    options?: StoreOptions<RI>
  ): Promise<boolean> {
    let url = `/${this.$resourceName}`;

    if (options?.query) {
      url += `?${new URLSearchParams(options.query)}`;
    }

    const response = await this.$httpClient.post<HTTPResponseItem<RI>>(
      url,
      data
    );

    if (!options?.store) {
      const { data } = response;

      this.$resource.set((data as any)[this.$pk], data);
    } else {
      options.store(this.$resource, response);
    }

    return true;
  }

  public async update(
    id: IPK,
    data: Record<string, Partial<RI>>,
    options?: UpdateOptions<RI>
  ): Promise<boolean> {
    let url = `/${this.$resourceName}/${id}`;

    if (options?.query) {
      url += `?${new URLSearchParams(options.query)}`;
    }

    const response = await this.$httpClient.put<HTTPResponseItem<RI>>(
      url,
      data
    );

    if (!options?.store) {
      const { data } = response;

      const entries = Object.entries(data);

      entries.forEach(([key, val]) => this.$resource.setProperty(id, key, val));
    } else {
      options.store(this.$resource, response);
    }

    return true;
  }

  public async destroy(
    id: IPK,
    options?: DestroyOptions<RI>
  ): Promise<boolean> {
    let url = `/${this.$resourceName}/${id}`;

    if (options?.query) {
      url += `?${new URLSearchParams(options.query)}`;
    }

    await this.$httpClient.delete<RI>(url);

    if (!options?.store) {
      this.$resource.delete(id);
    } else {
      options.store(this.$resource);
    }

    return true;
  }
}

export { BaseModel };
