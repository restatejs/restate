import type { IHTTPClient, Restate, IStore } from ".";

export declare const $restate: { instance?: Restate };

export declare function createRestate(provider: {
  httpClient: IHTTPClient;
  store: IStore;
}): Restate;
