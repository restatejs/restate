import type { Restate, IHTTPClient, IResource } from "..";

export declare class CoreModel<RI> {
  public $resource: IResource<RI>;

  public $httpClient: IHTTPClient;

  constructor(public $resourceName: string, public $restate: Restate);
}
