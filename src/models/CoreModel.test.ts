import { Resource } from "..";

import { CoreModel } from "./CoreModel";

describe("models/CoreModel", () => {
  test("should be able to instantiate the CoreModel class", async () => {
    const resourceName = "test";
    const coreModel = new CoreModel(resourceName);

    expect(coreModel).toHaveProperty("$resourceName", resourceName);
    expect(Reflect.get(coreModel, "$resource")).toBeInstanceOf(Resource);
  });
});
