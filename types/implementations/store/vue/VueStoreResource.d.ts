import type { IPK, IResource, IResourceItem } from "types";

import type { ResourceState, RestateStore } from "./VueStore";

export declare class VueStoreResource<RI extends IResourceItem>
  implements IResource<RI>
{
  private state: ResourceState<RI>;

  constructor(private resourceName: string, private store: RestateStore<RI>);

  get(id: IPK): RI;

  getAll(): RI[];

  set(id: IPK, data: RI): this;

  setProperty(id: IPK, prop: string, value: string | number): this;

  has(id: IPK): boolean;

  delete(id: IPK): void;

  clear(): void;
}
