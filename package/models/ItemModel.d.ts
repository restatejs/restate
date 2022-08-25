import type { Load } from "types/utils/load";

import type { Axios } from "axios";
import type { Ref } from "vue";

import type {
  LoadWithData,
  ShowOptions,
  UpdateOptions,
} from "./CollectionModel";
import { CoreModel } from "./CoreModel";

class ItemModel<RI> extends CoreModel<RI> {
  public $pk = "id";

  constructor(public $resourceName: string, public $axios: Axios) {
    super($resourceName);
  }

  public data(): Ref<Partial<RI>>;

  public show(
    options?: ShowOptions
  ): LoadWithData<Ref<Partial<RI> | Record<string, never>>>;

  public update(data: Partial<RI>, options?: UpdateOptions): Load;
}

export { ItemModel };
