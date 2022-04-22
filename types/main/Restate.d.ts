import { IStore, IHTTPClient } from "types";

import { CoreModel } from "@/index";

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
