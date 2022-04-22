import { VueStore } from "./VueStore";
import { VueStoreResource } from "./VueStoreResource";

const store = new VueStore();

const rootState = Reflect.get(store, "store");

describe("Store", () => {
  test("add", () => {
    expect(rootState.users).toBe(undefined);

    store.add("users");

    expect(rootState.users).toEqual({ data: {} });
  });

  test("get", () => {
    expect(rootState.users).toEqual({ data: {} });

    const resource = store.get("users");

    expect(resource).toEqual(new VueStoreResource("users", rootState));
  });

  test("has", () => {
    expect(store.has("users")).toBe(true);
    expect(store.has("test")).toBe(false);
  });

  test("delete", () => {
    expect(rootState.users).toEqual({ data: {} });

    store.delete("users");

    expect(rootState.users).toBe(undefined);
  });

  test("clear", () => {
    store.add("users");

    expect(rootState).not.toEqual({});

    store.clear();

    expect(rootState).toEqual({});
  });
});
