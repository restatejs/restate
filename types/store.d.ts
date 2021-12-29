export type IResourceItem = Record<string, unknown>;

export type IResourceCollection<RI extends IResourceItem = IResourceItem> =
  RI[];

export type IPK = string | number;

export interface IResource<RI extends IResourceItem = IResourceItem> {
  get(id: PK): RI | undefined;
  getAll(): IResourceCollection<RI>;
  set(id: PK, data: RI): this;
  setProperty(id: PK, prop: string, value: unknown): this;
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
