import type { IPK, IResource } from "types";
import type {
  ResourceState,
  RestateStore,
} from "types/implementations/store/vue";

class VueStoreResource<RI extends object> implements IResource<RI> {
  private state: ResourceState<RI>;

  constructor(private resourceName: string, private store: RestateStore) {
    if (!(resourceName in store)) {
      store[resourceName] = {
        data: {},
      };
    }

    this.state = store[resourceName];
  }

  get(id: IPK): Partial<RI> | undefined {
    const item = this.state.data[id];

    if (!item) this.state.data[id] = {};

    return item;
  }

  getAll(): RI[] {
    const all = Object.values(this.state.data);

    return all as RI[];
  }

  set(id: IPK, data: RI): this {
    this.state.data[id] = data;

    return this;
  }

  setProperty(id: IPK, prop: string, value: string | number): this {
    const item = this.state.data[id];

    if (item) {
      Reflect.set(item, prop, value);
    }

    return this;
  }

  has(id: IPK): boolean {
    return id in this.state.data;
  }

  delete(id: IPK): void {
    delete this.state.data[id];
  }

  clear(): void {
    this.state.data = {};
  }
}

export { VueStoreResource };
