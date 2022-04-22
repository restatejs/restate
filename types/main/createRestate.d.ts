import { IHTTPClient } from "./HttpClient";
import { Restate } from "./Restate";
import { IStore } from "./Store";

export declare function createRestate(provider: {
  httpClient: IHTTPClient;
  store: IStore;
}): Restate;
