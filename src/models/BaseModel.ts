import {
  DestroyOptions,
  HTTPResponseCollection,
  HTTPResponseItem,
  IHTTPClient,
  IndexOptions,
  IPK,
  IResource,
  IResourceCollection,
  IResourceItem,
  ShowOptions,
  StoreOptions,
  UpdateOptions,
} from "types";

import { Restate } from "@/Restate";

import { CoreModel } from "./CoreModel";

class BaseModel<RI extends IResourceItem = IResourceItem> extends CoreModel {
  public $resource: IResource<RI>;

  public $httpClient: IHTTPClient;

  private $pk: string;

  constructor(private $resourceName: string, private $restate: Restate) {
    super($resourceName, $restate);

    this.$pk = "id";

    this.$httpClient = $restate.httpClient;

    if (!this.$restate.store.has($resourceName)) {
      this.$resource = this.$restate.store.add<RI>($resourceName);
    } else {
      this.$resource = this.$restate.store.get<RI>($resourceName);
    }
  }

  public async index(
    options?: IndexOptions<RI>
  ): Promise<IResourceCollection<RI>> {
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

      data.forEach((item) => this.$resource.set(item[this.$pk], item));
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

      this.$resource.set(data[this.$pk], data);
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

      this.$resource.set(data[this.$pk], data);
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
