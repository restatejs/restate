import type { AfterRequest } from "types/models/HTTPModel";
import type {
  ComputedProperty,
  ItemModelOptions,
  ShowOptions,
  UpdateOptions,
} from "types/models/ItemModel";
import type { Load } from "types/utils/load";

import type { Axios } from "axios";
import type { Ref } from "vue";
import { computed } from "vue";

import { HTTPModel } from "./HTTPModel";

class ItemModel<RI> extends HTTPModel<RI> {
  public readonly $axios: Axios;

  protected readonly $computedProperties?: Record<string, ComputedProperty<RI>>;

  constructor({ resourceName, axios, computedProperties }: ItemModelOptions) {
    super({ resourceName, axios });

    this.$axios = axios;
    this.$computedProperties = computedProperties;
  }

  public data(): Ref<RI> {
    return this.$resource.get(this.$resourceName);
  }

  public show(options?: ShowOptions): Load<Ref<RI>> {
    const afterRequest: AfterRequest<RI> = (data) => {
      const computedPropertiesEntries = Object.entries(
        this.$computedProperties || {}
      );

      if (this.$computedProperties) {
        computedPropertiesEntries.forEach(([prop, callback]) => {
          (data as any)[prop] = computed(() => callback(data));
        });
      }

      this.$resource.set(this.$resourceName, data);
    };

    const responseItem = this.$resource.get(this.$resourceName);

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
}

export { ItemModel };
