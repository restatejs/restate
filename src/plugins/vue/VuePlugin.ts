import { $restate, createRestate } from "@/createRestate";
import { BaseModel } from "@/models/BaseModel";
import { Restate } from "@/Restate";

import { provider } from "./provider";

export function useRestate<RI = any>(resourceName: string): BaseModel<RI> {
  if (!$restate.instance) {
    createRestate(provider);
  }

  const restate = $restate.instance as Restate;

  let model = restate.get(resourceName) as BaseModel<RI>;

  if (!model) {
    model = new BaseModel(resourceName, restate);

    restate.set(resourceName, model);
  }

  return model;
}
