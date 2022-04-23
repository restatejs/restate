import type { IHTTPClient, IResource } from "types";

import type Restate from "..";

import { $restate } from "..";

class CoreModel<RI = any> {
  public $resource: IResource<RI>;

  public $httpClient: IHTTPClient;

  constructor(public $resourceName: string) {
    if (this.$restate.has($resourceName)) {
      throw new Error(
        `RESTATE ERROR: there is already a Model that the resource name is '${$resourceName}'.`
      );
    }

    this.$restate.set($resourceName, this);

    this.$httpClient = this.$restate.httpClient;

    if (!this.$restate.store.has($resourceName)) {
      this.$resource = this.$restate.store.add<RI>($resourceName);
    } else {
      this.$resource = this.$restate.store.get<RI>($resourceName);
    }
  }

  public get $restate(): Restate {
    if (!$restate.instance) {
      throw new Error(`RESTATE ERROR: restate was not initialized.`);
    }

    return $restate.instance;
  }
}

export { CoreModel };
