import { IHTTPClient, IResource } from "types";

import { Restate } from "@/Restate";

export declare class CoreModel<RI> {
  protected $resource: IResource<RI>;

  protected $httpClient: IHTTPClient;

  constructor(protected $resourceName: string, protected $restate: Restate);
}
