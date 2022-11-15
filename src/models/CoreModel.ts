import { Resource } from "..";

class CoreModel<RI> {
  protected readonly $resource: Resource<RI>;

  protected readonly $resourceName: string;

  constructor(resourceName: string) {
    this.$resourceName = resourceName;
    this.$resource = new Resource<RI>();
  }
}

export { CoreModel };
