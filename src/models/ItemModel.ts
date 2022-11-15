import type {
  LoadWithData,
  MapAfterRequest,
  ShowOptions,
  UpdateOptions,
} from "types/models/CollectionModel";
import type { ItemModelOptions } from "types/models/ItemModel";
import type { Load } from "types/utils/load";

import type { Axios } from "axios";
import type { Ref } from "vue";

import { createURL } from "@/utils/createURL";
import { load } from "@/utils/load";

import { CoreModel } from "./CoreModel";

class ItemModel<RI> extends CoreModel<RI> {
  public readonly $axios: Axios;

  protected $mapAfterRequest?: MapAfterRequest;

  constructor({ resourceName, axios, mapAfterRequest }: ItemModelOptions) {
    super(resourceName);

    this.$axios = axios;
    this.$mapAfterRequest = mapAfterRequest;
  }

  public data(): Ref<RI> {
    return this.$resource.get(this.$resourceName);
  }

  public show(
    options?: ShowOptions
  ): LoadWithData<Ref<RI | Record<string, never>>> {
    const url = createURL(
      "/:resourceName",
      { resourceName: this.$resourceName },
      options?.query
    );

    const { loaded, loading } = load(async () => {
      const { data } = await this.$axios.get<RI>(url);

      const mappedItem =
        options?.mapAfterRequest?.(data) ??
        this.$mapAfterRequest?.(data) ??
        data;

      this.$resource.set(this.$resourceName, mappedItem);
    });

    return {
      data: this.$resource.get(this.$resourceName),
      loaded,
      loading,
    };
  }

  public update(data: Partial<RI>, options?: UpdateOptions): Load {
    const url = createURL(
      "/:resourceName",
      { resourceName: this.$resourceName },
      options?.query
    );

    return load(async () => {
      await this.$axios.put(url, data);

      Object.entries(data).forEach(([key, val]) =>
        this.$resource.setProperty(
          this.$resourceName,
          key,
          val as string | number
        )
      );
    });
  }
}

export { ItemModel };
