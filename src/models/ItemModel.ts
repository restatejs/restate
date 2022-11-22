import type { AfterRequest } from "types/models/HTTPModel";
import type {
  ItemModelOptions,
  ShowOptions,
  UpdateOptions,
  ComputedProperty,
} from "types/models/ItemModel";
import type { Load } from "types/utils/load";

import type { Axios } from "axios";
import type { Ref } from "vue";
import { computed } from "vue";

import { HTTPModel } from "./HTTPModel";

class ItemModel<RI extends object> extends HTTPModel<RI> {
  public readonly $axios: Axios;

  protected readonly $computedProperties: Map<string, ComputedProperty<RI>>;

  constructor({
    resourceName,
    axios,
    computedProperties = {},
  }: ItemModelOptions<RI>) {
    super({ resourceName, axios });

    this.$axios = axios;
    this.$computedProperties = new Map(Object.entries(computedProperties));
  }

  public data(): Ref<RI | undefined> {
    return this.$resource.get(this.$resourceName);
  }

  public show(options?: ShowOptions): Load<Ref<RI | undefined>> {
    const responseItem = this.$resource.get(this.$resourceName);

    const afterRequest: AfterRequest<RI> = (data) => {
      this.$resource.set(this.$resourceName, data);

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
        this.$resource.setProperty(
          this.$resourceName,
          key,
          val as string | number
        );
      });
    };

    return this.request(`/${this.$resourceName}`, {
      method: "PUT",
      query: options?.query,
      data,
      afterRequest,
    });
  }

  private $insertComputedProperties(data: Ref<RI>) {
    this.$computedProperties.forEach((callback, prop) => {
      (data.value as any)[prop] = computed(() => callback(data));
    });
  }
}

export { ItemModel };
