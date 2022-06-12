import type { Ref } from "vue";

import type { Resource } from "..";

export declare class CoreModel<RI> {
  public $resource: Resource<RI>;

  constructor(public $resourceName: string);

  public load(request: () => Promise<void>): {
    loaded: Promise<boolean>;
    loading: Ref<boolean>;
  };
}
