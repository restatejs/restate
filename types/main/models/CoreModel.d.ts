import { IHTTPClient, IResource } from "types";

import { Restate } from "@/Restate";

export declare class CoreModel<RI> {
  public $resource: IResource<RI>;

  public $httpClient: IHTTPClient;

  constructor(public $resourceName: string, public $restate: Restate);
}
