import type { ComputedRef } from "vue";

import type { ResourceEntity, PickNumberOrStringKeys } from ".";

export interface ResourceCollectionState<
  RI extends ResourceEntity,
  PK extends PickNumberOrStringKeys<RI>
> {
  data: Record<RI[PK], RI | undefined>;
}

export declare class CollectionResource<
  RI extends ResourceEntity,
  PK extends PickNumberOrStringKeys<RI>
> {
  protected state: ResourceCollectionState<RI, PK>;

  public get(id: RI[PK]): Ref<Readonly<RI> | undefined>;

  public getAll(): ComputedRef<(RI | undefined)[]>;

  public set(id: RI[PK], data: RI): Readonly<RI>;

  public setProperty<P extends string & keyof RI>(
    id: RI[PK],
    prop: P,
    value: RI[P]
  ): Readonly<RI>;

  public has(id: RI[PK]): boolean;

  public delete(id: RI[PK]): void;

  public clear(): void;
}
