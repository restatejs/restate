export * from "./database";
export * from "./httpClient";
export * from "./store";
export * from "./coreModel";
export * from "./baseModel";

import { CoreModel } from "@/CoreModel";
import { IHTTPClient } from "./httpClient";
import { IStore } from "./store";

export declare class Restate {
  private $models: Map<string, CoreModel>;

  constructor(public httpClient: IHTTPClient, public store: IStore);

  public get(resourceName: string): CoreModel | undefined;

  public entries(): IterableIterator<[string, CoreModel]>;

  public set(resourceName: string, model: CoreModel): this;

  public has(resourceName: string): boolean;

  public delete(resourceName: string): boolean;

  public clear(): void;
}

export default Restate;
