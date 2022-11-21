import type {
  IndexOptions,
  ShowOptions,
  StoreOptions,
  UpdateOptions,
  DestroyOptions,
  CollectionModelOptions,
  ComputedProperty,
  CollectionModelDataOptions,
  ArrayCompareFn,
} from "types/models/CollectionModel";
import type { AfterRequest } from "types/models/HTTPModel";
import type { Load } from "types/utils/load";

import type { ComputedRef, Ref } from "vue";
import { computed, ref } from "vue";

import { HTTPModel } from "./HTTPModel";

class CollectionModel<RI> extends HTTPModel<RI> {
  public readonly $primaryKey: string;

  protected readonly $computedProperties?: Record<string, ComputedProperty<RI>>;

  constructor({
    resourceName,
    primaryKey,
    axios,
    computedProperties,
  }: CollectionModelOptions) {
    super({ resourceName, axios });

    this.$primaryKey = primaryKey;
    this.$computedProperties = computedProperties;
  }

  public data(options?: CollectionModelDataOptions<RI>): ComputedRef<RI[]> {
    const { sort, filter } = options ?? {};

    let data = this.$resource.getAll();

    if (filter || sort) {
      data = computed(() => {
        let clonedData = [...data.value];

        if (filter) {
          if (typeof filter === "function") {
            clonedData = clonedData.filter(filter);
          } else {
            clonedData = clonedData.filter((item, index, array) => {
              const filterFailed = filter
                .map((filterCallback) => filterCallback(item, index, array))
                .includes(false);

              return !filterFailed;
            });
          }
        }

        if (sort) {
          const callback: ArrayCompareFn<RI> =
            typeof sort === "function"
              ? sort
              : (a: RI, b: RI) => `${a[sort]}`.localeCompare(`${b[sort]}`);

          clonedData.sort(callback);
        }

        return clonedData;
      });
    }

    return data;
  }

  public item(id: string | number): Ref<RI> {
    return this.$resource.get(id);
  }

  public index(options?: IndexOptions): Load<ComputedRef<RI[]>> {
    const responseItems = this.$resource.getAll();

    const afterRequest: AfterRequest<RI[]> = (data) => {
      if (options?.merge !== true) {
        this.$resource.clear();
      }

      const computedPropertiesEntries = Object.entries(
        this.$computedProperties || {}
      );

      data.forEach((item: any) => {
        if (this.$computedProperties) {
          computedPropertiesEntries.forEach(([prop, callback]) => {
            item[prop] = computed(() => callback(item));
          });
        }

        this.$resource.set(item[this.$primaryKey], item);
      });
    };

    return this.request(
      `/${this.$resourceName}`,
      {
        method: "GET",
        query: options?.query,
        afterRequest,
      },
      responseItems
    );
  }

  public show(
    id: string | number,
    options?: ShowOptions
  ): Load<Ref<RI | Record<string, never>>> {
    const responseItem = this.$resource.get(id);

    const afterRequest: AfterRequest<RI> = (data) => {
      const computedPropertiesEntries = Object.entries(
        this.$computedProperties || {}
      );

      if (this.$computedProperties) {
        computedPropertiesEntries.forEach(([prop, callback]) => {
          (data as any)[prop] = computed(() => callback(data));
        });
      }

      this.$resource.set(id, data);
    };

    return this.request(
      `/${this.$resourceName}/${id}`,
      {
        method: "GET",
        query: options?.query,
        afterRequest,
      },
      responseItem
    );
  }

  public store<P = Record<string, unknown>>(
    data: P,
    options?: StoreOptions
  ): Load<ComputedRef<RI | null>> {
    const responseItemId: Ref<string | number | null> = ref(null);

    const responseItem: ComputedRef<RI | null> = computed(() => {
      if (responseItemId.value === null) return null;

      return this.$resource.get(responseItemId.value).value;
    });

    const afterRequest: AfterRequest<RI> = (responseData) => {
      this.$resource.set((data as any)[this.$primaryKey], responseData);
      responseItemId.value = (data as any)[this.$primaryKey];
    };

    return this.request(
      `/${this.$resourceName}`,
      {
        method: "POST",
        query: options?.query,
        data,
        afterRequest,
      },
      responseItem
    );
  }

  public update<D = Record<string, unknown>>(
    id: string | number,
    data: D,
    options?: UpdateOptions
  ): Load {
    const afterRequest = () => {
      Object.entries(data as any).forEach(([key, val]) =>
        this.$resource.setProperty(id, key, val as string | number)
      );
    };

    return this.request(`/${this.$resourceName}/${id}`, {
      method: "PUT",
      query: options?.query,
      data,
      afterRequest,
    });
  }

  public destroy(id: string | number, options?: DestroyOptions): Load {
    const afterRequest = () => this.$resource.delete(id);

    return this.request(`/${this.$resourceName}/${id}`, {
      method: "DELETE",
      query: options?.query,
      afterRequest,
    });
  }
}

export { CollectionModel };
