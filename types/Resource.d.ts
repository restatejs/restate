import type { ComputedRef, Ref } from "vue";

export interface ResourceState<RI> {
  data: Record<string | number, Ref<Partial<RI>>>;
}

class Resource<RI> {
  public state: ResourceState;

  get(id: string | number): Ref<Partial<RI>>;

  getAll(): ComputedRef<Ref<Partial<RI>>[]>;

  set(id: string | number, data: Partial<RI>): this;

  setProperty(id: string | number, prop: string, value: string | number): this;

  has(id: string | number): boolean;

  delete(id: string | number): void;

  clear(): void;
}

export { Resource };
