import type { Resource } from "..";

class CoreModel<RI> {
  public $resource: Resource<RI>;

  constructor(public $resourceName: string);
}

export { CoreModel };
