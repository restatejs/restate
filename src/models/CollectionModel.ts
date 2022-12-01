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
import type { PickNumberOrStringKeys, ResourceEntity } from "types/resources";
import type { Load } from "types/utils/load";

import type { ComputedRef, Ref } from "vue";
import { computed, ref } from "vue";

import { CollectionResource } from "@/resources/CollectionResource";

import { HTTPModel } from "./HTTPModel";

class CollectionModel<
  RI extends ResourceEntity,
  PK extends PickNumberOrStringKeys<RI>,
  Response extends ResourceEntity = RI
> extends HTTPModel {
  public readonly $resource: CollectionResource<RI, PK>;

  public readonly $primaryKey: string;

  protected readonly $computedProperties: ComputedProperties<RI>;

  protected readonly $mapAfterRequest?: MapAfterRequest<Response>;

  constructor({
    resourceName,
    primaryKey,
    axios,
    computedProperties = {},
    mapAfterRequest,
  }: CollectionModelOptions<RI, Response, PK>) {
    super({ resourceName, axios });

    this.$resource = new CollectionResource();

    this.$primaryKey = primaryKey;

    this.$computedProperties = new Map(Object.entries(computedProperties));

    this.$mapAfterRequest = mapAfterRequest;
  }

  public data(
    options?: CollectionModelDataOptions<RI>
  ): ComputedRef<(RI | undefined)[]> {
    const { sort, filter } = options ?? {};

    let data = this.$resource.getAll();

    if (filter || sort) {
      data = computed(() => {
        const originalData = this.$resource.getAll();
        let clonedData = [...originalData.value];

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
          const callback: ArrayCompareFn<RI | undefined> =
            typeof sort === "function"
              ? sort
              : (a: RI | undefined, b: RI | undefined) =>
                  `${a?.[sort]}`.localeCompare(`${b?.[sort]}`);

          clonedData.sort(callback);
        }

        return clonedData;
      });
    }

    return data;
  }

  public item(id: RI[PK]): Ref<RI | undefined> {
    return this.$resource.get(id);
  }

  public index(options?: IndexOptions): Load<ComputedRef<(RI | undefined)[]>> {
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

  public show(id: RI[PK], options?: ShowOptions): Load<Ref<RI | undefined>> {
    const responseItem = this.$resource.get(id);

    const afterRequest: AfterRequest<Response> = (data) => {
      const mappedData = this.$mapAfterRequest?.(data) ?? data;

      const settedItem = this.$resource.set(id, mappedData as unknown as RI);

      this.$insertComputedProperties(settedItem);

      responseItem.value = settedItem;
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
    const responseItemId: Ref<RI[PK] | null> = ref(null);

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
    id: RI[PK],
    data: D,
    options?: UpdateOptions
  ): Load {
    const afterRequest = () => {
      Object.entries(data as any).forEach(([key, val]) => {
        this.$resource.setProperty(id, key as any, val as any);
      });
    };

    return this.request(`/${this.$resourceName}/${id}`, {
      method: "PUT",
      query: options?.query,
      data,
      afterRequest,
    });
  }

  public destroy(id: RI[PK], options?: DestroyOptions): Load {
    const afterRequest = () => this.$resource.delete(id);

    return this.request(`/${this.$resourceName}/${id}`, {
      method: "DELETE",
      query: options?.query,
      afterRequest,
    });
  }

  private $insertComputedProperties(data: RI | undefined): void {
    if (!data || Reflect.get(data, "_insertedComputedProperties")) {
      return;
    }

    this.$computedProperties.forEach((callback, prop) => {
      if (prop in (data as any)) {
        throw new Error(`The ${String(prop)} property is already defined.`);
      }

      data[prop] = computed(() => callback(data)) as any;
    });

    Reflect.set(data, "_insertedComputedProperties", true);
  }
}

export { CollectionModel };
