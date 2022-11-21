import type { Axios } from "axios";
import type { ComputedRef, Ref } from "vue";

import type { Load } from "../utils/load";
import { HTTPModel } from "./HTTPModel";

export type ComputedProperty<RI> = (item: RI) => any;

export interface CollectionModelOptions {
  resourceName: string;
  axios: Axios;
  primaryKey: string;
  computedProperties?: Record<string, ComputedProperty<RI>>;
}

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

export type ArrayCompareFn<O> = (a: O, b: O) => number;

export type ArrayFilterFn<O> = (value: O, index: number, array: O[]) => boolean;

export interface CollectionModelDataOptions<RI> {
  sort?: keyof RI | ArrayCompareFn<RI>;
  filter: ArrayFilterFn<RI> | ArrayFilterFn<RI>[];
}

export declare class CollectionModel<RI> extends HTTPModel<RI> {
  public readonly $primaryKey: string;

  protected readonly $computedProperties?: Record<string, ComputedProperty<RI>>;

  constructor(options: CollectionModelOptions);

  public data(options?: CollectionModelDataOptions<RI>): ComputedRef<RI[]>;

  public item(id: string | number): Ref<RI>;

  public index(options?: IndexOptions): Load<ComputedRef<RI[]>>;

  public show(
    id: string | number,
    options?: ShowOptions
  ): Load<Ref<RI | Record<string, never>>>;

  public store<P = Record<string, unknown>>(
    data: P,
    options?: StoreOptions
  ): Load<ComputedRef<RI | null>>;

  public update<D = Record<string, unknown>>(
    id: string | number,
    data: D,
    options?: UpdateOptions
  ): Load;

  public destroy(id: string | number, options?: DestroyOptions): Load;
}
