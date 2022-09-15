import type { Axios } from "axios";
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

  public data(): ComputedRef<Partial<RI>[]>;

  public item(id: string | number): Ref<Partial<RI>>;

  public index(
    options?: IndexOptions<RI>
  ): LoadWithData<ComputedRef<Partial<RI>[]>>;

  public show(
    id: string | number,
    options?: ShowOptions
  ): LoadWithData<Ref<Partial<RI> | Record<string, never>>>;

  public store(
    payload: Partial<RI>,
    options?: StoreOptions
  ): LoadWithData<ComputedRef<Partial<RI> | null>>;

  public update(
    id: string | number,
    data: Partial<RI>,
    options?: UpdateOptions
  ): Load;

  public destroy(id: string | number, options?: DestroyOptions): Load;
}
