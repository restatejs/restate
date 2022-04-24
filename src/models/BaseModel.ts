import type { IPK } from "types";
import type {
  IndexOptions,
  ShowOptions,
  StoreOptions,
  UpdateOptions,
  DestroyOptions,
} from "types/models/BaseModel";

import { CoreModel } from "./CoreModel";

function createURL(
  pattern: string,
  params: Record<string, string | number>,
  query?: Record<string, string | number>
): string {
  const regExp = /(\/:\w+)/g;

  let url = pattern.replace(regExp, (match) => {
    const paramKey = match.slice(2);

    if (!params[paramKey]) {
      throw new Error();
    }

    return `/${params[paramKey]}`;
  });

  if (query) {
    url += `?${new URLSearchParams(query as Record<string, string>)}`;
  }

  return url;
}

class BaseModel<RI> extends CoreModel<RI> {
  public $pk = "id";

  constructor(public $resourceName: string) {
    super($resourceName);
  }

  public async index(options?: IndexOptions): Promise<RI[]> {
    const url = createURL(
      "/:resourceName",
      { resourceName: this.$resourceName },
      options?.query
    );

    const reponseData = await this.$httpClient.get<RI[]>(url);

    if (options?.merge !== true) {
      this.$resource.clear();
    }

    reponseData.forEach((item: any) =>
      this.$resource.set(item[this.$pk], item)
    );

    return this.$resource.getAll();
  }

  public async show(id: IPK, options?: ShowOptions): Promise<RI | undefined> {
    const url = createURL(
      "/:resourceName/:id",
      { resourceName: this.$resourceName, id },
      options?.query
    );

    const reponseData = await this.$httpClient.get<RI>(url);

    this.$resource.set((reponseData as any)[this.$pk], reponseData);

    return this.$resource.get(id);
  }

  public async store(
    data: Partial<RI>,
    options?: StoreOptions
  ): Promise<boolean> {
    const url = createURL(
      "/:resourceName",
      { resourceName: this.$resourceName },
      options?.query
    );

    const reponseData = await this.$httpClient.post<RI>(url, data);

    this.$resource.set((reponseData as any)[this.$pk], reponseData);

    return true;
  }

  public async update(
    id: IPK,
    data: Partial<RI>,
    options?: UpdateOptions
  ): Promise<boolean> {
    const url = createURL(
      "/:resourceName/:id",
      { resourceName: this.$resourceName, id },
      options?.query
    );

    await this.$httpClient.put(url, data);

    Object.entries(data).forEach(([key, val]) =>
      this.$resource.setProperty(id, key, val)
    );

    return true;
  }

  public async destroy(id: IPK, options?: DestroyOptions): Promise<boolean> {
    const url = createURL(
      "/:resourceName/:id",
      { resourceName: this.$resourceName, id },
      options?.query
    );

    await this.$httpClient.delete(url);

    this.$resource.delete(id);

    return true;
  }
}

export { BaseModel };