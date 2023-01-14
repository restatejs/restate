import type { Axios } from "axios";
import type { ComputedRef } from "vue";

import type {
  ComputedProperties,
  PickNumberOrStringKeys,
  ResourceEntity,
} from "../resources";
import type {
  CollectionResource,
  State,
} from "../resources/CollectionResource";
import type { Load } from "../utils/load";
import { HTTPModel } from "./HTTPModel";

export type MapAfterRequest<Raw> = (item: Raw) => unknown;

export interface CollectionModelOptions<
  RI extends ResourceEntity,
  Raw extends ResourceEntity,
  PK extends PickNumberOrStringKeys<Raw>
> {
  resourceName: string;
  axios: Axios;
  primaryKey: PK;
  computedProperties?: ComputedProperties<RI>;
  mapAfterRequest?: MapAfterRequest<Raw>;
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

export interface DataOptions<RI> {
  sort?: keyof RI | ArrayCompareFn<RI | undefined>;
  filter?: ArrayFilterFn<RI | undefined> | ArrayFilterFn<RI | undefined>[];
}

export declare class CollectionModel<
  RI extends ResourceEntity,
  Raw extends ResourceEntity = RI,
  PK extends PickNumberOrStringKeys<Raw> = PickNumberOrStringKeys<Raw>
> extends HTTPModel {
  public readonly $resource: CollectionResource<RI, Raw, PK>;

  public readonly $primaryKey: PK;

  protected readonly $mapAfterRequest?: MapAfterRequest<Raw>;

  constructor(options: CollectionModelOptions<RI, Raw, PK>);

  public data(options?: DataOptions<RI>): State<RI>;

  public item(id: Raw[PK]): RI | undefined;

  public index(options?: IndexOptions): Load;

  public show(id: Raw[PK], options?: ShowOptions): Load;

  public store<P = Record<string, unknown>>(
    data: P,
    options?: StoreOptions
  ): Load;

  public update<D = Record<string, unknown>>(
    id: Raw[PK],
    data: D,
    options?: UpdateOptions
  ): Load;

  public destroy(id: Raw[PK], options?: DestroyOptions): Load;
}
