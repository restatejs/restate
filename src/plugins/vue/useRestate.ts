import Restate from "@/index";
import { BaseModel } from "@/models/BaseModel";

import { provider } from "./provider";

declare global {
  interface Window {
    restate: Restate;
  }
}

export function useRestate<RI>(resourceName: string): BaseModel<RI> {
  if (!window.restate) {
    window.restate = new Restate(provider.httpClient, provider.store);
  }

  const { restate } = window;

  let model = restate.get(resourceName) as BaseModel<RI>;

  if (!model) {
    model = new BaseModel(resourceName, restate);

    restate.set(resourceName, model);
  }

  return model;
}
