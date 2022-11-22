import type { Axios } from "axios";
import type { ComputedRef, Ref } from "vue";

import type { Load } from "../utils/load";
import { HTTPModel } from "./HTTPModel";

export type ComputedProperty<RI> = (item: Ref<RI>) => any;

export type ComputedProperties<RI> = Record<string, ComputedProperty<RI>>;

export interface CollectionModelOptions<RI> {
  resourceName: string;
  axios: Axios;
  primaryKey: string;
  computedProperties?: ComputedProperties<RI>;
}

export interface BaseOptions {
  query?: Record<string, string>;
}

export interface IndexOptions extends BaseOptions {
  clear?: boolean;
}

export type ShowOptions = BaseOptions;

export type StoreOptions = BaseOptions;

export type UpdateOptions = BaseOptions;

export type DestroyOptions = BaseOptions;

export type ArrayCompareFn<O> = (a: O, b: O) => number;

export type ArrayFilterFn<O> = (value: O, index: number, array: O[]) => boolean;

export interface CollectionModelDataOptions<RI> {
  sort?: keyof RI | ArrayCompareFn<RI>;
  filter: ArrayFilterFn<RI> | ArrayFilterFn<RI>[];
}

export declare class CollectionModel<RI extends object> extends HTTPModel<RI> {
  public readonly $primaryKey: string;

  protected readonly $computedProperties: Map<string, ComputedProperty<RI>>;

  constructor(options: CollectionModelOptions<RI>);

  public data(options?: CollectionModelDataOptions<RI>): ComputedRef<RI[]>;

  public item(id: string | number): Ref<RI | undefined>;

  public index(options?: IndexOptions): Load<ComputedRef<RI[]>>;

  public show(
    id: string | number,
    options?: ShowOptions
  ): Load<Ref<RI | undefined>>;

  public store<P = Record<string, unknown>>(
    data: P,
    options?: StoreOptions
  ): Load<ComputedRef<RI | undefined>>;

  public update<D = Record<string, unknown>>(
    id: string | number,
    data: D,
    options?: UpdateOptions
  ): Load;

  public destroy(id: string | number, options?: DestroyOptions): Load;

  private $insertComputedProperties(data: Ref<RI>);
}
