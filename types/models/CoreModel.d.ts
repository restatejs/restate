import type { Ref } from "vue";

import type { Resource } from "..";

export declare class CoreModel<RI> {
  public $resource: Resource<RI>;

  constructor(public $resourceName: string);
}
