import type { IStore, IHTTPClient } from "types";

import type { CoreModel } from "./models/CoreModel";

class Restate {
  private $models: Map<string, CoreModel<unknown>> = new Map();

  constructor(public httpClient: IHTTPClient, public store: IStore) {}

  public get(resourceName: string): CoreModel<unknown> | undefined {
    return this.$models.get(resourceName);
  }

  public entries(): IterableIterator<[string, CoreModel<unknown>]> {
    return this.$models.entries();
  }

  public set(resourceName: string, model: CoreModel<unknown>): this {
    this.$models.set(resourceName, model);

    return this;
  }

  public has(resourceName: string): boolean {
    return this.$models.has(resourceName);
  }

  public delete(resourceName: string): boolean {
    return this.$models.delete(resourceName);
  }

  public clear(): void {
    return this.$models.clear();
  }
}

export { Restate };
