export type IResourceItem = Record<string, string | number>;

export type IPK = string | number;

export interface IResource<RI extends ResourceItem = ResourceItem> {
  get(id: PK): RI | undefined;
  getAll(): RI[];
  set(id: PK, data: RI): this;
  setProperty(id: PK, prop: string, value: string | number): this;
  has(id: PK): boolean;
  delete(id: PK): void;
  clear(): void;
}

export interface IStore<RE extends IResource = IResource> {
  get<RI extends IResourceItem>(resourceName: string): RE<RI> | undefined;
  add<RI extends IResourceItem>(resourceName: string): RE<RI>;
  has(resourceName: string): boolean;
  delete(resourceName: string): boolean;
  clear(): void;
}
