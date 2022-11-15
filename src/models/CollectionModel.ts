import type {
  IndexOptions,
  ShowOptions,
  StoreOptions,
  UpdateOptions,
  DestroyOptions,
  LoadWithData,
  CollectionModelOptions,
  MapAfterRequest,
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

  constructor(
    public $resourceName: string,
    public $axios: Axios,
    public options?: CollectionModelOptions
  ) {
    super($resourceName);

    if (this.options?.mapAfterRequest) {
      this.$mapAfterRequest = this.options.mapAfterRequest;
    }
  }

  protected $mapAfterRequest?: MapAfterRequest = undefined;

  public data(): ComputedRef<RI[]> {
    return this.$resource.getAll();
  }

  public item(id: string | number): Ref<RI> {
    return this.$resource.get(id);
  }

  public index(options?: IndexOptions): LoadWithData<ComputedRef<RI[]>> {
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

      data.forEach((item: any) => {
        const mappedItem =
          options?.mapAfterRequest?.(item) ??
          this.$mapAfterRequest?.(item) ??
          item;

        this.$resource.set(item[this.$pk], mappedItem);
      });
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
  ): LoadWithData<Ref<RI | Record<string, never>>> {
    const url = createURL(
      "/:resourceName/:id",
      { resourceName: this.$resourceName, id },
      options?.query
    );

    const { loaded, loading } = load(async () => {
      const { data } = await this.$axios.get<RI>(url);

      const mappedItem =
        options?.mapAfterRequest?.(data) ??
        this.$mapAfterRequest?.(data) ??
        data;

      this.$resource.set(id, mappedItem);
    });

    return {
      data: this.$resource.get(id),
      loaded,
      loading,
    };
  }

  public store<P = Record<string, unknown>>(
    data: P,
    options?: StoreOptions
  ): LoadWithData<ComputedRef<RI | null>> {
    const url = createURL(
      "/:resourceName",
      { resourceName: this.$resourceName },
      options?.query
    );

    const responseItemId: Ref<string | number | null> = ref(null);

    const responseItem: ComputedRef<RI | null> = computed(() => {
      if (responseItemId.value === null) return null;

      return this.$resource.get(responseItemId.value).value;
    });

    const { loaded, loading } = load(async () => {
      const { data: responseData } = await this.$axios.post<RI>(url, data);

      this.$resource.set((data as any)[this.$pk], responseData);
      responseItemId.value = (data as any)[this.$pk];
    });

    return {
      data: responseItem,
      loaded,
      loading,
    };
  }

  public update<D = Record<string, unknown>>(
    id: string | number,
    data: D,
    options?: UpdateOptions
  ): Load {
    const url = createURL(
      "/:resourceName/:id",
      { resourceName: this.$resourceName, id },
      options?.query
    );

    return load(async () => {
      await this.$axios.put(url, data);

      Object.entries(data as any).forEach(([key, val]) =>
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
