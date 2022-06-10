import { Resource } from "..";

class CoreModel<RI> {
  public $resource: Resource<RI>;

  constructor(public $resourceName: string) {
    this.$resource = new Resource<RI>();
  }
}

export { CoreModel };
