import { load } from "./load";

describe("utils/load", () => {
  test("should be able to execute the load function", async () => {
    const callback = () => {
      return new Promise<void>((resolve) => {
        setTimeout(() => resolve(), 1000);
      });
    };

    const { loaded, loading } = load(callback);

    expect(loading.value).toBe(true);

    await loaded;

    expect(loading.value).toBe(false);
  });

  test("should be able to execute the load function with data", async () => {
    const loadData = {
      status: "beforeload",
    };

    const callback = () => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          loadData.status = "afterload";
          resolve();
        }, 1000);
      });
    };

    const { loaded, loading, data } = load(callback, loadData);

    expect(loading.value).toBe(true);
    expect(data).toHaveProperty("status", "beforeload");

    await loaded;

    expect(loading.value).toBe(false);
    expect(data).toHaveProperty("status", "afterload");
  });
});
