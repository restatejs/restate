import type { IStore } from "types";

import type { VueStoreResource } from "./VueStoreResource";

export * from "./VueStoreResource";

export interface ResourceState<RI extends object> {
  data: Record<string, RI | undefined>;
}

export type RestateStore = Record<string, ResourceState<RI>>;

export declare class VueStore implements IStore<VueStoreResource<object>> {
  private resources = new Map();

  private store: RestateStore;

  constructor();

  get<RI extends object>(
    resourceName: string
  ): VueStoreResource<RI> | undefined;

  add<RI extends object>(resourceName: string): VueStoreResource<RI>;

  has(resourceName: string): boolean;

  delete(resourceName: string): boolean;

  clear(): void;
}
