import type { ComputedRef, Ref } from "vue";

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
  public state: ResourceCollectionState<RI, PK>;

  public get(id: RI[PK]): Ref<RI | undefined>;

  public getAll(): ComputedRef<RI[]>;

  public set(id: RI[PK], data: RI): Ref<RI>;

  public setProperty<P extends string & keyof RI>(
    id: RI[PK],
    prop: P,
    value: RI[P]
  ): Ref<RI>;

  public has(id: RI[PK]): boolean;

  public delete(id: RI[PK]): void;

  public clear(): void;
}
