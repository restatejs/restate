import { BaseModel } from "@/models/BaseModel";
import { Restate } from "@/Restate";

import { useRestate } from "./useRestate";

describe("VuePlugin", () => {
  test("useRestate", () => {
    const resourceName = "users;";

    expect(window.restate).toBe(undefined);

    const users = useRestate(resourceName);

    expect(window.restate).toBeInstanceOf(Restate);

    expect(users).toBeInstanceOf(BaseModel);

    expect(window.restate.get(resourceName)).toBe(users);
  });
});
