import type { Axios } from "axios";
import type { Ref } from "vue";

import type { Load } from "../utils/load";
import { HTTPModel } from "./HTTPModel";

export type ComputedProperty<RI> = (item: RI) => any;

export interface ItemModelOptions {
  resourceName: string;
  axios: Axios;
  computedProperties?: Record<string, ComputedProperty<RI>>;
}

export interface BaseOptions {
  query?: Record<string, string>;
}

export type ShowOptions = BaseOptions;

export type UpdateOptions = BaseOptions;

export declare class ItemModel<RI> extends HTTPModel<RI> {
  public readonly $axios: Axios;

  protected readonly $computedProperties?: Record<string, ComputedProperty<RI>>;

  constructor(options: ItemModelOptions);

  public data(): Ref<RI>;

  public show(options?: ShowOptions): Load<Ref<RI>>;

  public update(data: Partial<RI>, options?: UpdateOptions): Load;
}
