import type { BaseModel } from "../models/BaseModel";
import type { Restate } from "../Restate";

declare global {
  interface Window {
    restate: Restate;
  }
}

export declare function useRestate<RI>(resourceName: string): BaseModel<RI>;
