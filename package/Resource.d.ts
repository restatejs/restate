import type { ComputedRef, Ref } from "vue";

export interface ResourceState<RI> {
  data: Record<string | number, Ref<Partial<RI>>>;
}

class Resource<RI> {
  public state: ResourceState;

  public get(id: string | number): Ref<Partial<RI>>;

  public getAll(): ComputedRef<Ref<Partial<RI>>[]>;

  public set(id: string | number, data: Partial<RI>): this;

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
