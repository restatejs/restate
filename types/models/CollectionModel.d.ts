import type { Axios } from "axios";
import type { ComputedRef, Ref } from "vue";

import type { Load } from "../utils/load";
import { CoreModel } from "./CoreModel";

export type MapAfterRequest = (item: any) => RI;

export interface CollectionModelOptions {
  resourceName: string;
  axios: Axios;
  primaryKey: string;
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
  public readonly $primaryKey: string;

  public readonly $axios: Axios;

  protected $mapAfterRequest?: MapAfterRequest;

  constructor(options: CollectionModelOptions);

  public data(): ComputedRef<RI[]>;

  public item(id: string | number): Ref<RI>;

  public index(options?: IndexOptions): LoadWithData<ComputedRef<RI[]>>;

  public show(
    id: string | number,
    options?: ShowOptions
  ): LoadWithData<Ref<RI | Record<string, never>>>;

  public store<P = Record<string, unknown>>(
    payload: P,
    options?: StoreOptions
  ): LoadWithData<ComputedRef<RI | null>>;

  public update<D = Record<string, unknown>>(
    id: string | number,
    data: D,
    options?: UpdateOptions
  ): Load;

  public destroy(id: string | number, options?: DestroyOptions): Load;
}
