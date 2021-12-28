import { IHTTPClient, IStore } from "types";

import { CoreModel } from "@/CoreModel";
import { Restate } from "@/Restate";

const httpClient = {} as IHTTPClient;

const store = {} as IStore;

const restate = new Restate(httpClient, store);

describe("CoreModel", () => {
  test("construct", () => {
    const coreModel = new CoreModel("users", restate);

    expect(restate.get("users")).toBe(coreModel);
  });
});
