import type { Resource } from "..";

export declare class CoreModel<RI> {
  protected readonly $resource: Resource<RI>;

  protected readonly $resourceName: string;

  constructor(resourceName: string);
}
