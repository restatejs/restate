import type { IStore } from "types";
import type { RestateStore } from "types/implementations/store/vue";

import { reactive } from "vue";

import { VueStoreResource } from "./VueStoreResource";

class VueStore implements IStore<VueStoreResource<object>> {
  private resources = new Map();

  private store: RestateStore;

  constructor() {
    this.store = reactive({});
  }

  get<RI extends object>(
    resourceName: string
  ): VueStoreResource<RI> | undefined {
    const resource = this.resources.get(resourceName);

    return resource;
  }

  add<RI extends object>(resourceName: string): VueStoreResource<RI> {
    const resource = new VueStoreResource<RI>(resourceName, this.store);

    this.resources.set(resourceName, resource);

    return resource;
  }

  has(resourceName: string): boolean {
    return this.resources.has(resourceName);
  }

  delete(resourceName: string): boolean {
    delete this.store[resourceName];

    return this.resources.delete(resourceName);
  }

  clear(): void {
    Object.keys(this.store).forEach(
      (resourceName) => delete this.store[resourceName]
    );

    this.resources.clear();
  }
}

export { VueStore };
