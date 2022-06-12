import { CoreModel } from "./CoreModel";

describe("CoreModel", () => {
  test("load", async () => {
    const model = new CoreModel("model");

    const { loaded, loading } = model.load(
      () =>
        new Promise((resolve) => {
          setTimeout(() => resolve(), 1000);
        })
    );

    expect(loading.value).toBe(true);

    await loaded;

    expect(loading.value).toBe(false);
  });
});
