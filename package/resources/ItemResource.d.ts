import type { ComputedRef, Ref } from "vue";

import type { ResourceEntity } from ".";

export type State<RI extends ResourceEntity> = Ref<RI | undefined>;

export type ComputedState<RI extends ResourceEntity> = ComputedRef<
  RI | undefined
>;

export interface ItemResourceOptions<
  RI extends ResourceEntity,
  Raw extends ResourceEntity = RI
> {
  state: State<Raw>;
  computedState: ComputedState<RI>;
}

export declare class ItemResource<
  RI extends ResourceEntity,
  Raw extends ResourceEntity = RI
> {
  protected $state: State<Raw>;

  protected readonly $computedState: ComputedState<RI>;

  constructor(options: ItemResourceOptions<RI, Raw>);

  public get(): ComputedState<Raw>;

  public set(data: Raw): void;

  public setProperty<P extends string & keyof Raw>(
    prop: P,
    value: Raw[P]
  ): void;

  public has(): boolean;

  public clear(): void;
}
