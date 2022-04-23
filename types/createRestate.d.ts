import type { IHTTPClient, Restate, IStore } from ".";

export declare function createRestate(provider: {
  httpClient: IHTTPClient;
  store: IStore;
}): Restate;
