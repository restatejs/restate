import type {
  IndexOptions,
  ShowOptions,
  StoreOptions,
  UpdateOptions,
  DestroyOptions,
  LoadWithData,
} from "types/models/CollectionModel";
import type { Load } from "types/utils/load";

import type { Axios } from "axios";
import type { ComputedRef, Ref } from "vue";
import { computed, ref } from "vue";

import { createURL } from "@/utils/createURL";
import { load } from "@/utils/load";

import { CoreModel } from "./CoreModel";

class CollectionModel<RI> extends CoreModel<RI> {
  public $pk = "id";

  constructor(public $resourceName: string, public $axios: Axios) {
    super($resourceName);
  }

  public data(): ComputedRef<Partial<RI>[]> {
    return this.$resource.getAll();
  }

  public item(id: string | number): Ref<Partial<RI>> {
    return this.$resource.get(id);
  }

  public index(
    options?: IndexOptions
  ): LoadWithData<ComputedRef<Partial<RI>[]>> {
    const url = createURL(
      "/:resourceName",
      { resourceName: this.$resourceName },
      options?.query
    );

    const { loaded, loading } = load(async () => {
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
  ): LoadWithData<Ref<Partial<RI> | Record<string, never>>> {
    const url = createURL(
      "/:resourceName/:id",
      { resourceName: this.$resourceName, id },
      options?.query
    );

    const { loaded, loading } = load(async () => {
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
    payload: Partial<RI>,
    options?: StoreOptions
  ): LoadWithData<ComputedRef<Partial<RI> | null>> {
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

    const { loaded, loading } = load(async () => {
      const { data } = await this.$axios.post<Partial<RI>>(url, payload);

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
  ): Load {
    const url = createURL(
      "/:resourceName/:id",
      { resourceName: this.$resourceName, id },
      options?.query
    );

    return load(async () => {
      await this.$axios.put(url, data);

      Object.entries(data).forEach(([key, val]) =>
        this.$resource.setProperty(id, key, val as string | number)
      );
    });
  }

  public destroy(id: string | number, options?: DestroyOptions): Load {
    const url = createURL(
      "/:resourceName/:id",
      { resourceName: this.$resourceName, id },
      options?.query
    );

    return load(async () => {
      await this.$axios.delete(url);
      this.$resource.delete(id);
    });
  }
}

export { CollectionModel };
