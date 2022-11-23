import type { ComputedRef, Ref } from "vue";

export interface ResourceState<RI> {
  data: Record<string | number, RI>;
}

export declare class Resource<RI> {
  public state: ResourceState<RI>;

  public get(id: string | number): Ref<RI | undefined>;

  public getAll(): ComputedRef<RI[]>;

  public set(id: string | number, data: RI): Ref<RI>;

  public setProperty(
    id: string | number,
    prop: string,
    value: unknown
  ): Ref<RI>;

  public has(id: string | number): boolean;

  public delete(id: string | number): void;

  public clear(): void;
}
