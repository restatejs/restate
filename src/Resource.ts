import type { ResourceState } from "types/Resource";

import type { ComputedRef, Ref } from "vue";
import { toRef, reactive, computed } from "vue";

class Resource<RI> {
  public state: ResourceState<RI>;

  constructor() {
    this.state = reactive({ data: {} });
  }

  public get(id: string | number): Ref<RI | undefined> {
    const item = this.state.data[id];

    if (!item) {
      this.state.data[id] = undefined as RI;
    }

    return toRef(this.state.data, id);
  }

  public getAll(): ComputedRef<RI[]> {
    const computedCollection = computed(() => {
      const collection = Object.values(this.state.data) as unknown;

      return collection as RI[];
    });

    return computedCollection;
  }

  public set(id: string | number, data: RI): Ref<RI> {
    this.state.data[id] = data;

    return toRef(this.state.data, id);
  }

  public setProperty(
    id: string | number,
    prop: string,
    value: unknown
  ): Ref<RI> {
    const item = this.state.data[id];

    if (!item) {
      throw new Error("Property not updated.");
    }

    (item as any)[prop] = value;

    return toRef(this.state.data, id);
  }

  public has(id: string | number): boolean {
    return id in this.state.data;
  }

  public delete(id: string | number): void {
    delete this.state.data[id];
  }

  clear(): void {
    this.state.data = {};
  }
}

export { Resource };
