import type { Axios } from "axios";
import type { Ref } from "vue";

import type { Load } from "../utils/load";
import type {
  LoadWithData,
  MapAfterRequest,
  ShowOptions,
  UpdateOptions,
} from "./CollectionModel";
import { CoreModel } from "./CoreModel";

export interface ItemModelOptions {
  resourceName: string;
  axios: Axios;
  mapAfterRequest?: MapAfterRequest;
}

export declare class ItemModel<RI> extends CoreModel<RI> {
  public $pk: string;

  public $resourceName: string;

  public $axios: Axios;

  constructor(options: ItemModelOptions);

  public data(): Ref<RI>;

  public show(
    options?: ShowOptions
  ): LoadWithData<Ref<RI | Record<string, never>>>;

  public update(data: Partial<RI>, options?: UpdateOptions): Load;
}
