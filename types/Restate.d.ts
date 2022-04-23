import type { IStore, IHTTPClient } from "types";

import type { CoreModel } from "@/index";

export type IHTTPClienteRequestBody =
  | Record<string, unknown>
  | Record<string, unknown>[];

export interface IHTTPClient {
  get<R>(url: string): Promise<R>;
  post<R>(url: string, body: IHTTPClienteRequestBody): Promise<R>;
  put(url: string, body: IHTTPClienteRequestBody): void;
  delete(url: string): void;
}

export type IPK = string | number;

export interface IResource<RI> {
  get(id: PK): RI | undefined;
  getAll(): RI[];
  set(id: PK, data: RI): this;
  setProperty(id: PK, prop: string, value: unknown): this;
  has(id: PK): boolean;
  delete(id: PK): void;
  clear(): void;
}

export interface IStore<RE extends IResource = IResource> {
  get<RI>(resourceName: string): RE<RI> | undefined;
  add<RI>(resourceName: string): RE<RI>;
  has(resourceName: string): boolean;
  delete(resourceName: string): boolean;
  clear(): void;
}

declare class Restate {
  private $models: Map<string, CoreModel>;

  constructor(public httpClient: IHTTPClient, public store: IStore);

  public get(resourceName: string): CoreModel | undefined;

  public entries(): IterableIterator<[string, CoreModel]>;

  public set(resourceName: string, model: CoreModel): this;

  public has(resourceName: string): boolean;

  public delete(resourceName: string): boolean;

  public clear(): void;
}

export { Restate };
