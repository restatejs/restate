import type { IHTTPClient, IResource } from "types";

import type Restate from "..";

class CoreModel<RI> {
  public $resource: IResource<RI>;

  public $httpClient: IHTTPClient;

  constructor(public $resourceName: string, public $restate: Restate) {
    if ($restate.has($resourceName)) {
      throw new Error(
        `RESTATE ERROR: there is already a Model that the resource name is '${$resourceName}'.`
      );
    }

    $restate.set($resourceName, this);

    this.$httpClient = $restate.httpClient;

    if (!$restate.store.has($resourceName)) {
      this.$resource = $restate.store.add<RI>($resourceName);
    } else {
      this.$resource = $restate.store.get<RI>($resourceName);
    }
  }
}

export { CoreModel };
