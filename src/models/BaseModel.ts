import type {
  IndexOptions,
  ShowOptions,
  StoreOptions,
  UpdateOptions,
  DestroyOptions,
} from "types/models/BaseModel";

import type { Axios } from "axios";
import type { ComputedRef, Ref } from "vue";

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

  constructor(public $resourceName: string, public $axios: Axios) {
    super($resourceName);
  }

  public index(options?: IndexOptions): {
    data: ComputedRef<Ref<Partial<RI>>[]>;
    load: Promise<boolean>;
  } {
    const url = createURL(
      "/:resourceName",
      { resourceName: this.$resourceName },
      options?.query
    );

    const load = new Promise<boolean>((resolve) => {
      this.$axios
        .get<RI[]>(url)
        .then(({ data }) => {
          if (options?.merge !== true) {
            this.$resource.clear();
          }

          data.forEach((item: any) => this.$resource.set(item[this.$pk], item));
        })
        .finally(() => resolve(true));
    });

    return {
      data: this.$resource.getAll(),
      load,
    };
  }

  public show(
    id: string | number,
    options?: ShowOptions
  ): {
    data: Ref<Partial<RI> | Record<string, never>>;
    load: Promise<boolean>;
  } {
    const url = createURL(
      "/:resourceName/:id",
      { resourceName: this.$resourceName, id },
      options?.query
    );

    const load = new Promise<boolean>((resolve) => {
      this.$axios
        .get<RI>(url)
        .then(({ data }) => this.$resource.set(id, data))
        .finally(() => resolve(true));
    });

    return {
      data: this.$resource.get(id),
      load,
    };
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

    await this.$axios
      .post<Partial<RI>>(url, data)
      .then(({ data }) => this.$resource.set((data as any)[this.$pk], data));

    return true;
  }

  public async update(
    id: string | number,
    data: Partial<RI>,
    options?: UpdateOptions
  ): Promise<boolean> {
    const url = createURL(
      "/:resourceName/:id",
      { resourceName: this.$resourceName, id },
      options?.query
    );

    await this.$axios.put(url, data);

    Object.entries(data).forEach(([key, val]) =>
      this.$resource.setProperty(id, key, val as string | number)
    );

    return true;
  }

  public async destroy(
    id: string | number,
    options?: DestroyOptions
  ): Promise<boolean> {
    const url = createURL(
      "/:resourceName/:id",
      { resourceName: this.$resourceName, id },
      options?.query
    );

    await this.$axios.delete(url);

    this.$resource.delete(id);

    return true;
  }
}

export { BaseModel };
