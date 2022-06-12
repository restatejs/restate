import type {
  IndexOptions,
  ShowOptions,
  StoreOptions,
  UpdateOptions,
  DestroyOptions,
} from "types/models/BaseModel";

import type { Axios } from "axios";
import type { ComputedRef, Ref } from "vue";
import { computed, ref } from "vue";

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

  public collection(): ComputedRef<Ref<Partial<RI>>[]> {
    return this.$resource.getAll();
  }

  public item(id: string | number): Ref<Partial<RI>> {
    return this.$resource.get(id);
  }

  public index(options?: IndexOptions): {
    data: ComputedRef<Ref<Partial<RI>>[]>;
    loaded: Promise<boolean>;
    loading: Ref<boolean>;
  } {
    const url = createURL(
      "/:resourceName",
      { resourceName: this.$resourceName },
      options?.query
    );

    const { loaded, loading } = this.load(async () => {
      const { data } = await this.$axios.get<RI[]>(url);

      if (options?.merge !== true) {
        this.$resource.clear();
      }

      data.forEach((item: any) => this.$resource.set(item[this.$pk], item));
    });

    return {
      data: this.$resource.getAll(),
      loaded,
      loading,
    };
  }

  public show(
    id: string | number,
    options?: ShowOptions
  ): {
    data: Ref<Partial<RI> | Record<string, never>>;
    loaded: Promise<boolean>;
    loading: Ref<boolean>;
  } {
    const url = createURL(
      "/:resourceName/:id",
      { resourceName: this.$resourceName, id },
      options?.query
    );

    const { loaded, loading } = this.load(async () => {
      const { data } = await this.$axios.get<RI>(url);

      this.$resource.set(id, data);
    });

    return {
      data: this.$resource.get(id),
      loaded,
      loading,
    };
  }

  public store(
    payloaded: Partial<RI>,
    options?: StoreOptions
  ): {
    data: ComputedRef<Partial<RI> | null>;
    loaded: Promise<boolean>;
    loading: Ref<boolean>;
  } {
    const url = createURL(
      "/:resourceName",
      { resourceName: this.$resourceName },
      options?.query
    );

    const responseItemId: Ref<string | number | null> = ref(null);

    const responseItem: ComputedRef<Partial<RI> | null> = computed(() => {
      if (responseItemId.value === null) return null;

      return this.$resource.get(responseItemId.value).value;
    });

    const { loaded, loading } = this.load(async () => {
      const { data } = await this.$axios.post<Partial<RI>>(url, payloaded);

      this.$resource.set((data as any)[this.$pk], data);
      responseItemId.value = (data as any)[this.$pk];
    });

    return {
      data: responseItem,
      loaded,
      loading,
    };
  }

  public update(
    id: string | number,
    data: Partial<RI>,
    options?: UpdateOptions
  ): {
    loaded: Promise<boolean>;
    loading: Ref<boolean>;
  } {
    const url = createURL(
      "/:resourceName/:id",
      { resourceName: this.$resourceName, id },
      options?.query
    );

    return this.load(async () => {
      await this.$axios.put(url, data);

      Object.entries(data).forEach(([key, val]) =>
        this.$resource.setProperty(id, key, val as string | number)
      );
    });
  }

  public destroy(
    id: string | number,
    options?: DestroyOptions
  ): {
    loaded: Promise<boolean>;
    loading: Ref<boolean>;
  } {
    const url = createURL(
      "/:resourceName/:id",
      { resourceName: this.$resourceName, id },
      options?.query
    );

    return this.load(async () => {
      await this.$axios.delete(url);
      this.$resource.delete(id);
    });
  }
}

export { BaseModel };
