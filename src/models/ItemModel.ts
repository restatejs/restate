import type { AfterRequest } from "types/models/HTTPModel";
import type {
  ItemModelOptions,
  ShowOptions,
  UpdateOptions,
  ComputedProperties,
  MapAfterRequest,
} from "types/models/ItemModel";
import type { ResourceEntity } from "types/resources";
import type { Load } from "types/utils/load";

import type { Ref } from "vue";
import { computed } from "vue";

import { ItemResource } from "@/resources/ItemResource";

import { HTTPModel } from "./HTTPModel";

class ItemModel<
  RI extends ResourceEntity,
  Response extends ResourceEntity = RI
> extends HTTPModel {
  protected readonly $resource: ItemResource<RI>;

  protected readonly $computedProperties: ComputedProperties<RI>;

  protected readonly $mapAfterRequest?: MapAfterRequest<Response>;

  constructor({
    resourceName,
    axios,
    computedProperties = {},
    mapAfterRequest,
  }: ItemModelOptions<RI, Response>) {
    super({ resourceName, axios });

    this.$resource = new ItemResource();

    this.$computedProperties = new Map(Object.entries(computedProperties));

    this.$mapAfterRequest = mapAfterRequest;
  }

  public data(): Ref<RI | undefined> {
    return this.$resource.get();
  }

  public show(options?: ShowOptions): Load<Ref<RI | undefined>> {
    const responseItem = this.$resource.get();

    const afterRequest: AfterRequest<Response> = (data) => {
      const mappedData = this.$mapAfterRequest?.(data) ?? data;

      this.$resource.set(mappedData as RI);

      this.$insertComputedProperties(responseItem as Ref<RI>);
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

export { ItemModel };
