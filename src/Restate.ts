import { IHTTPClient } from "types/httpClient";
import { IStore } from "types";
import { Model } from "@/Model";

class Restate {
  private $models: Map<string, Model> = new Map();

  constructor(public httpClient: IHTTPClient, public store: IStore) { }

  public get(resourceName: string): Model | undefined {
    return this.$models.get(resourceName);
  }

  public entries(): IterableIterator<[string, Model]> {
    return this.$models.entries();
  }

  public set(resourceName: string, model: Model): this {
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
