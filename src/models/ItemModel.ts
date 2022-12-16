import type { AfterRequest } from "types/models/HTTPModel";
import type {
  ItemModelOptions,
  ShowOptions,
  UpdateOptions,
  MapAfterRequest,
} from "types/models/ItemModel";
import type { ComputedPropertiesMap, ResourceEntity } from "types/resources";
import type { ComputedState } from "types/resources/ItemResource";
import type { Load } from "types/utils/load";

import type { ItemResource } from "@/resources/ItemResource";
import { useItemResource } from "@/resources/useItemResource";

import { HTTPModel } from "./HTTPModel";

class ItemModel<
  RI extends ResourceEntity,
  Raw extends ResourceEntity = RI
> extends HTTPModel {
  protected readonly $resource: ItemResource<RI, Raw>;

  protected readonly $computedProperties: ComputedPropertiesMap<RI>;

  protected readonly $mapAfterRequest?: MapAfterRequest<Raw>;

  constructor({
    resourceName,
    axios,
    computedProperties = {},
    mapAfterRequest,
  }: ItemModelOptions<RI, Raw>) {
    super({ resourceName, axios });

    this.$resource = useItemResource<RI, Raw>({ computedProperties });

    this.$computedProperties = new Map(Object.entries(computedProperties));

    this.$mapAfterRequest = mapAfterRequest;
  }

  public data(): ComputedState<RI> {
    return this.$resource.get();
  }

  public show(options?: ShowOptions): Load<ComputedState<RI>> {
    const responseItem = this.$resource.get();

    const afterRequest: AfterRequest<Raw> = (data) => {
      const mappedData = this.$mapAfterRequest?.(data) ?? data;

      this.$resource.set(mappedData as Raw);
    };

    return this.request(
      `${this.$resourceName}`,
      {
        method: "GET",
        query: options?.query,
        afterRequest,
      },
      responseItem
    );
  }

  public update(data: Partial<RI>, options?: UpdateOptions): Load {
    const afterRequest: AfterRequest<RI> = () => {
      Object.entries(data).forEach(([key, val]) => {
        this.$resource.setProperty(key, val as any);
      });
    };

    return this.request(`/${this.$resourceName}`, {
      method: "PUT",
      query: options?.query,
      data,
      afterRequest,
    });
  }
}

export { ItemModel };
