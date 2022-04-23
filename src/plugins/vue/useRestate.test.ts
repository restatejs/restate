import { createRestate } from "@/createRestate";
import { BaseModel } from "@/models/BaseModel";
import { Restate } from "@/Restate";

import { provider } from "./provider";
import { useRestate } from "./useRestate";

describe("VuePlugin", () => {
  test("useRestate", () => {
    const resourceName = "users;";
    const restate = createRestate(provider);

    expect(restate instanceof Restate).toBe(true);

    let users = restate.get(resourceName);

    expect(users).toBe(undefined);

    users = useRestate(resourceName);

    expect(users).toBeInstanceOf(BaseModel);

    expect(restate.get(resourceName)).toBe(users);
  });
});
