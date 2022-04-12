import { IHTTPClient, IResource } from "types";

import Restate from "..";

class CoreModel<RI = any> {
  protected $resource: IResource<RI>;

  protected $httpClient: IHTTPClient;

  constructor(protected $resourceName: string, protected $restate: Restate) {
    if ($restate.has($resourceName)) {
      throw new Error(
        `RESTATE ERROR: there is already a Model that the resource name is '${$resourceName}'`
      );
    }

    $restate.set($resourceName, this);

    this.$httpClient = $restate.httpClient;

    if (!this.$restate.store.has($resourceName)) {
      this.$resource = this.$restate.store.add<RI>($resourceName);
    } else {
      this.$resource = this.$restate.store.get<RI>($resourceName);
    }
  }
}

export { CoreModel };
