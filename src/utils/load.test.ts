import { load } from "./load";

test("utils/load", async () => {
  const { loaded, loading } = load(
    () =>
      new Promise((resolve) => {
        setTimeout(() => resolve(), 1000);
      })
  );

  expect(loading.value).toBe(true);

  await loaded;

  expect(loading.value).toBe(false);
});
