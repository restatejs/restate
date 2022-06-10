import { VueStoreResource } from "@/implementations/store/vue/VueStoreResource";
import { provider } from "@/plugins/vue/provider";

import { CoreModel } from "./CoreModel";

import Restate from "..";

const restate = new Restate(provider.httpClient, provider.store);

describe("CoreModel", () => {
  test("new", () => {
    expect(restate.get("users")).toBe(undefined);
    expect(restate.store.get("users")).toBe(undefined);

    const UsersModel = new CoreModel("users", restate);

    expect(restate.get("users")).toBe(UsersModel);
    expect(restate.store.get("users")).toBeInstanceOf(VueStoreResource);
    expect(() => new CoreModel("users", restate)).toThrow();
  });
});
