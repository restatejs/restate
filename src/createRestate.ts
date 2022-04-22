import { IStore, IHTTPClient } from "types";

import { Restate } from "@/Restate";

export const $restate: { instance?: Restate } = {};

export function createRestate(provider: {
  httpClient: IHTTPClient;
  store: IStore;
}): Restate {
  $restate.instance = new Restate(provider.httpClient, provider.store);

  return $restate.instance;
}
