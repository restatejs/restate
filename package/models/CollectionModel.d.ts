import type { Axios } from "axios";
import type { ComputedRef, Ref } from "vue";

import type { Load } from "../utils/load";
import { CoreModel } from "./CoreModel";

export type MapAfterRequest = (item: any) => RI;

export interface CollectionModelOptions {
  mapAfterRequest?: MapAfterRequest;
}

export interface BaseOptions {
  query?: Record<string, string>;
}

export interface IndexOptions extends BaseOptions {
  merge?: boolean;
  mapAfterRequest?: MapAfterRequest;
}

export interface ShowOptions extends BaseOptions {
  mapAfterRequest?: MapAfterRequest;
}

export type StoreOptions = BaseOptions;

export type UpdateOptions = BaseOptions;

export type DestroyOptions = BaseOptions;

export type LoadWithData<D> = Load & { data: D };

export declare class CollectionModel<RI> extends CoreModel<RI> {
  public $pk: string;

  public $resourceName: string;

  public $axios: Axios;

  protected $mapAfterRequest?: MapAfterRequest;

  constructor(
    $resourceName: string,
    $axios: Axios,
    options?: CollectionModelOptions
  );

  public data(): ComputedRef<Partial<RI>[]>;

  public item(id: string | number): Ref<Partial<RI>>;

  public index(
    options?: IndexOptions
  ): LoadWithData<ComputedRef<Partial<RI>[]>>;

  public show(
    id: string | number,
    options?: ShowOptions
  ): LoadWithData<Ref<Partial<RI> | Record<string, never>>>;

  public store<P = Record<string, unknown>>(
    payload: P,
    options?: StoreOptions
  ): LoadWithData<ComputedRef<Partial<RI> | null>>;

  public update<D = Record<string, unknown>>(
    id: string | number,
    data: D,
    options?: UpdateOptions
  ): Load;

  public destroy(id: string | number, options?: DestroyOptions): Load;
}
