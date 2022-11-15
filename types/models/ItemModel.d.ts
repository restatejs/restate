import type { Axios } from "axios";
import type { Ref } from "vue";

import type { Load } from "../utils/load";
import type {
  LoadWithData,
  ShowOptions,
  UpdateOptions,
} from "./CollectionModel";
import { CoreModel } from "./CoreModel";

export declare class ItemModel<RI> extends CoreModel<RI> {
  public $pk: string;

  public $resourceName: string;

  public $axios: Axios;

  constructor($resourceName: string, $axios: Axios);

  public data(): Ref<RI>;

  public show(
    options?: ShowOptions
  ): LoadWithData<Ref<RI | Record<string, never>>>;

  public update(data: Partial<RI>, options?: UpdateOptions): Load;
}
