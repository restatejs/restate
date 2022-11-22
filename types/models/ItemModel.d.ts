import type { Axios } from "axios";
import type { Ref } from "vue";

import type { Load } from "../utils/load";
import { HTTPModel } from "./HTTPModel";

export type ComputedProperty<RI> = (item: Ref<RI>) => any;

export type ComputedProperties<RI> = Record<string, ComputedProperty<RI>>;

export interface ItemModelOptions<RI> {
  resourceName: string;
  axios: Axios;
  computedProperties?: ComputedProperties<RI>;
}

export interface BaseOptions {
  query?: Record<string, string>;
}

export type ShowOptions = BaseOptions;

export type UpdateOptions = BaseOptions;

export declare class ItemModel<RI extends object> extends HTTPModel<RI> {
  public readonly $axios: Axios;

  protected readonly $computedProperties: Map<string, ComputedProperty<RI>>;

  constructor(options: ItemModelOptions<RI>);

  public data(): Ref<RI | undefined>;

  public show(options?: ShowOptions): Load<Ref<RI | undefined>>;

  public update(data: Partial<RI>, options?: UpdateOptions): Load;

  private $insertComputedProperties(data: Ref<RI>);
}
