import type { Resource } from "..";

export declare class CoreModel<RI extends object> {
  public readonly $resourceName: string;

  protected readonly $resource: Resource<RI>;

  constructor(resourceName: string);
}
