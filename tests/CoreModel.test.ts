import { CoreModel } from "@/CoreModel";
import { Restate } from "@/Restate";
import { IHTTPClient, IStore } from "types";

const httpClient = {} as IHTTPClient;

const store = {} as IStore;

const restate = new Restate(httpClient, store);

describe("CoreModel", () => {
  test("construct", () => {
    const coreModel = new CoreModel("users", restate);

    expect(restate.get("users")).toBe(coreModel);
  });
});
