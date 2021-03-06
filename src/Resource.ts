import type { ResourceState } from "types/Resource";

import type { ComputedRef, Ref } from "vue";
import { toRef, ref, reactive, computed } from "vue";

class Resource<RI> {
  public state: ResourceState<RI>;

  constructor() {
    this.state = reactive({ data: {} });
  }

  get(id: string | number): Ref<Partial<RI>> {
    const item = this.state.data[id];

    if (item === undefined) this.set(id, {});

    return toRef(this.state.data, id);
  }

  getAll(): ComputedRef<Partial<RI>[]> {
    const computedCollection = computed(() => {
      const collection = Object.values(this.state.data) as unknown;

      return collection as Partial<RI>[];
    });

    return computedCollection;
  }

  set(id: string | number, data: Partial<RI>): this {
    this.state.data[id] = ref(data) as Ref<Partial<RI>>;

    return this;
  }

  setProperty(id: string | number, prop: string, value: string | number): this {
    const item = this.state.data[id];

    if (item) {
      Reflect.set(item, prop, value);
    }

    return this;
  }

  has(id: string | number): boolean {
    return id in this.state.data;
  }

  delete(id: string | number): void {
    delete this.state.data[id];
  }

  clear(): void {
    this.state.data = {};
  }
}

export { Resource };
