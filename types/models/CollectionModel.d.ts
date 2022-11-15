import type { ComputedRef, Ref } from "vue";

import type { Load } from "../utils/load";
import { CoreModel } from "./CoreModel";

export interface BaseOptions {
  query?: Record<string, string>;
}

export interface IndexOptions extends BaseOptions {
  merge?: boolean;
}

export type ShowOptions = BaseOptions;

export type StoreOptions = BaseOptions;

export type UpdateOptions = BaseOptions;

export type DestroyOptions = BaseOptions;

export type LoadWithData<D> = Load & { data: D };

export declare class CollectionModel<RI> extends CoreModel<RI> {
  public $pk: string;

  public $resourceName: string;

  public $axios: Axios;

  constructor($resourceName: string, $axios: Axios);

  public data(): ComputedRef<RI[]>;

  public item(id: string | number): Ref<RI>;

  public index(options?: IndexOptions): LoadWithData<ComputedRef<RI[]>>;

  public show(
    id: string | number,
    options?: ShowOptions
  ): LoadWithData<Ref<RI | Record<string, never>>>;

  public store(
    data: Partial<RI>,
    options?: StoreOptions
  ): LoadWithData<ComputedRef<RI | null>>;

  public update(
    id: string | number,
    data: Partial<RI>,
    options?: UpdateOptions
  ): Load;

  public destroy(id: string | number, options?: DestroyOptions): Load;
}
