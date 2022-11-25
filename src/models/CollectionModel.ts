import type {
  IndexOptions,
  ShowOptions,
  StoreOptions,
  UpdateOptions,
  DestroyOptions,
  CollectionModelOptions,
  CollectionModelDataOptions,
  ArrayCompareFn,
  ComputedProperties,
  MapAfterRequest,
} from "types/models/CollectionModel";
import type { AfterRequest } from "types/models/HTTPModel";
import type { Load } from "types/utils/load";

import type { ComputedRef, Ref } from "vue";
import { computed, ref } from "vue";

import { HTTPModel } from "./HTTPModel";

class CollectionModel<
  RI extends object,
  Response extends object = RI
> extends HTTPModel<RI> {
  public readonly $primaryKey: string;

  protected readonly $computedProperties: ComputedProperties<RI>;

  protected readonly $mapAfterRequest?: MapAfterRequest<Response, RI>;

  constructor({
    resourceName,
    primaryKey,
    axios,
    computedProperties = {},
    mapAfterRequest,
  }: CollectionModelOptions<RI, Response>) {
    super({ resourceName, axios });

    this.$primaryKey = primaryKey;

    this.$computedProperties = new Map(
      Object.entries(computedProperties)
    ) as ComputedProperties<RI>;

    this.$mapAfterRequest = mapAfterRequest;
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

  public item(id: string | number): Ref<RI | undefined> {
    return this.$resource.get(id);
  }

  public index(options?: IndexOptions): Load<ComputedRef<RI[]>> {
    const responseItems = this.$resource.getAll();

    const afterRequest: AfterRequest<Response[]> = (data) => {
      const mappedData = this.$mapAfterRequest
        ? data.map(this.$mapAfterRequest)
        : data;

      if (options?.clear !== false) {
        this.$resource.clear();
      }

      mappedData.forEach((item) => {
        const refItem = this.$resource.set(
          (item as any)[this.$primaryKey],
          item as unknown as RI
        );

        this.$insertComputedProperties(refItem);
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
  ): Load<Ref<RI | undefined>> {
    const responseItem = this.$resource.get(id);

    const afterRequest: AfterRequest<Response> = (data) => {
      const mappedData = this.$mapAfterRequest?.(data) ?? data;

      this.$resource.set(id, mappedData as unknown as RI);

      this.$insertComputedProperties(responseItem as Ref<RI>);
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
  ): Load<ComputedRef<RI | undefined>> {
    const responseItemId: Ref<string | number | null> = ref(null);

    const responseItem: ComputedRef<RI | undefined> = computed(() => {
      if (responseItemId.value === null) return undefined;

      return this.$resource.get(responseItemId.value).value;
    });

    const afterRequest: AfterRequest<Response> = (responseData) => {
      const mappedData = this.$mapAfterRequest?.(responseData) ?? responseData;

      const item = this.$resource.set(
        (data as any)[this.$primaryKey],
        mappedData as unknown as RI
      );

      responseItemId.value = (data as any)[this.$primaryKey];

      this.$insertComputedProperties(item);
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
      Object.entries(data as any).forEach(([key, val]) => {
        this.$resource.setProperty(id, key, val as string | number);
      });
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

  private $insertComputedProperties(data: Ref<RI>): void {
    if (Reflect.get(data.value, "_insertedComputedProperties")) {
      return;
    }

    Reflect.set(data.value, "_insertedComputedProperties", true);

    this.$computedProperties.forEach((callback, prop) => {
      if (prop in data.value) {
        throw new Error(`The ${String(prop)} property is already defined.`);
      }

      data.value[prop] = computed(() => callback(data)) as any;
    });
  }
}

export { CollectionModel };
