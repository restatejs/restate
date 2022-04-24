import { $restate, createRestate } from "@/createRestate";
import type Restate from "@/index";
import { BaseModel } from "@/models/BaseModel";

import { provider } from "./provider";

export function useRestate<RI>(resourceName: string): BaseModel<RI> {
  if (!$restate.instance) {
    createRestate(provider);
  }

  const restate = $restate.instance as Restate;

  let model = restate.get(resourceName) as BaseModel<RI>;

  if (!model) {
    model = new BaseModel(resourceName);

    restate.set(resourceName, model);
  }

  return model;
}
