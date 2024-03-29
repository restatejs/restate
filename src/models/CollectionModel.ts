import type {
  IndexOptions,
  ShowOptions,
  StoreOptions,
  UpdateOptions,
  DestroyOptions,
  CollectionModelOptions,
  DataOptions,
  ArrayCompareFn,
  MapAfterRequest,
} from "types/models/CollectionModel";
import type { AfterRequest } from "types/models/HTTPModel";
import type { PickNumberOrStringKeys, ResourceEntity } from "types/resources";
import type { State } from "types/resources/CollectionResource";
import type { Load } from "types/utils/load";

import { computed } from "vue";

import type { CollectionResource } from "@/resources/CollectionResource";
import { useCollectionResource } from "@/resources/useCollectionResource";

import { HTTPModel } from "./HTTPModel";

class CollectionModel<
  RI extends ResourceEntity,
  Raw extends ResourceEntity = RI,
  PK extends PickNumberOrStringKeys<Raw> = PickNumberOrStringKeys<Raw>
> extends HTTPModel {
  public readonly $resource: CollectionResource<RI, Raw, PK>;

  public readonly $primaryKey: PK;

  protected readonly $mapAfterRequest?: MapAfterRequest<Raw>;

  constructor({
    resourceName,
    primaryKey,
    axios,
    computedProperties = {},
    mapAfterRequest,
  }: CollectionModelOptions<RI, Raw, PK>) {
    super({ resourceName, axios });

    this.$resource = useCollectionResource<RI, Raw, PK>({
      primaryKey,
      computedProperties,
    });

    this.$primaryKey = primaryKey;

    this.$mapAfterRequest = mapAfterRequest;
  }

  public data(options?: DataOptions<RI>): State<RI> {
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

  public item(id: Raw[PK]): RI | undefined {
    return this.$resource.get(id);
  }

  public index(options?: IndexOptions): Load {
    const afterRequest: AfterRequest<Raw[]> = (data) => {
      const mappedData = (
        this.$mapAfterRequest ? data.map(this.$mapAfterRequest) : data
      ) as Raw[];

      this.$resource.setAll(mappedData, { clear: options?.clear });
    };

    return this.request(`/${this.$resourceName}`, {
      method: "GET",
      query: options?.query,
      afterRequest,
    });
  }

  public show(id: Raw[PK], options?: ShowOptions): Load {
    const afterRequest: AfterRequest<Raw> = (data) => {
      const mappedData = this.$mapAfterRequest?.(data) ?? data;

      this.$resource.set(id, mappedData as unknown as Raw);
    };

    return this.request(`/${this.$resourceName}/${id}`, {
      method: "GET",
      query: options?.query,
      afterRequest,
    });
  }

  public store<P = Record<string, unknown>>(
    data: P,
    options?: StoreOptions
  ): Load {
    const afterRequest: AfterRequest<Raw> = (responseData) => {
      const mappedData = this.$mapAfterRequest?.(responseData) ?? responseData;

      const itemId = (data as any)[this.$primaryKey];

      this.$resource.set(itemId, mappedData as unknown as Raw);
    };

    return this.request(`/${this.$resourceName}`, {
      method: "POST",
      query: options?.query,
      data,
      afterRequest,
    });
  }

  public update<D = Record<string, unknown>>(
    id: Raw[PK],
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

  public destroy(id: Raw[PK], options?: DestroyOptions): Load {
    const afterRequest = () => this.$resource.delete(id);

    return this.request(`/${this.$resourceName}/${id}`, {
      method: "DELETE",
      query: options?.query,
      afterRequest,
    });
  }
}

export { CollectionModel };
