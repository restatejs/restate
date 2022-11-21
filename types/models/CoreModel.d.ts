import type { Resource } from "..";

export declare class CoreModel<RI> {
  public readonly $resourceName: string;

  protected readonly $resource: Resource<RI>;

  constructor(resourceName: string);
}
