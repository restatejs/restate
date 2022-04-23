import type { Restate, IHTTPClient, IResource } from "..";

export declare class CoreModel<RI = any> {
  public $resource: IResource<RI>;

  public $httpClient: IHTTPClient;

  public $resourceName: string;

  constructor($resourceName: string);

  public get $restate(): Restate;
}
