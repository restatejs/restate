import type { Ref } from "vue";

import type { ResourceEntity } from ".";

export type ResourceItemState<RI extends ResourceEntity> = Ref<RI | undefined>;

export declare class ItemResource<RI extends ResourceEntity> {
  public state: ResourceItemState<RI>;

  public get(): ResourceItemState<RI>;

  public set(data: RI): Ref<RI>;

  public setProperty<P extends string & keyof RI>(
    prop: P,
    value: RI[P]
  ): Ref<RI>;

  public has(): boolean;

  public clear(): void;
}
