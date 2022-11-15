import type { ComputedRef, Ref } from "vue";

export interface ResourceState<RI> {
  data: Record<string | number, Ref<RI>>;
}

class Resource<RI> {
  public state: ResourceState;

  public get(id: string | number): Ref<RI>;

  public getAll(): ComputedRef<RI[]>;

  public set(id: string | number, data: RI): this;

  public setProperty(
    id: string | number,
    prop: string,
    value: string | number
  ): this;

  public has(id: string | number): boolean;

  public delete(id: string | number): void;

  public clear(): void;
}

export { Resource };
