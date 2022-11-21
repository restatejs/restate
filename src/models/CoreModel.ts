import { Resource } from "..";

class CoreModel<RI> {
  public readonly $resourceName: string;

  protected readonly $resource: Resource<RI>;

  constructor(resourceName: string) {
    this.$resourceName = resourceName;
    this.$resource = new Resource<RI>();
  }
}

export { CoreModel };
