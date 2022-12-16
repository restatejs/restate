import type { ComputedRef, Ref } from "vue";

import type { ResourceEntity, PickNumberOrStringKeys } from ".";
import type { Indexes } from "./Indexes";

export type State<RI extends ResourceEntity> = Ref<{ data: RI }[]>;

export type ComputedState<RI extends ResourceEntity> = ComputedRef<
  { data: RI }[]
>;

export interface CollectionResourceOptions<
  RI extends ResourceEntity,
  Raw extends ResourceEntity = RI,
  PK extends PickNumberOrStringKeys<Raw> = PickNumberOrStringKeys<Raw>
> {
  primaryKey: PK;
  indexes: Indexes<Raw[PK]>;
  state: State<Raw>;
  computedState: ComputedState<RI>;
}

export interface SetAllOptions {
  clear?: boolean;
}

export declare class CollectionResource<
  RI extends ResourceEntity,
  Raw extends ResourceEntity = RI,
  PK extends PickNumberOrStringKeys<Raw> = PickNumberOrStringKeys<Raw>
> {
  protected readonly $primaryKey: PK;

  protected $indexes: Indexes<Raw[PK]>;

  protected $state: State<Raw>;

  protected readonly $computedState: ComputedState<RI>;

  constructor(options: CollectionResourceOptions<RI, Raw, PK>);

  public get(id: Raw[PK]): ComputedRef<RI | undefined>;

  public getAll(): ComputedState<RI>;

  public set(id: Raw[PK], data: Raw): number;

  public setAll(collection: Raw[], options?: SetAllOptions): void;

  public setProperty<P extends string & keyof Raw>(
    id: Raw[PK],
    prop: P,
    value: Raw[P]
  ): void;

  public has(id: Raw[PK]): boolean;

  public delete(id: Raw[PK]): void;

  public clear(): void;
}
