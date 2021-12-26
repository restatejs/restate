export * from "./database";
export * from "./httpClient";
export * from "./store";
export * from "./model";

import { Model } from "@/Model";
import { IHTTPClient } from "./httpClient";
import { IStore } from "./store";

export declare class Restate {
  private $models: Map<string, Model>;

  constructor(public httpClient: IHTTPClient, public store: IStore);

  public get(resourceName: string): Model | undefined;

  public entries(): IterableIterator<[string, Model]>;

  public set(resourceName: string, model: Model): this;

  public has(resourceName: string): boolean;

  public delete(resourceName: string): boolean;

  public clear(): void;
}

export default Restate;
