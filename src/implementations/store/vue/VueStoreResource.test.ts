import { VueStore } from "./VueStore";
import { VueStoreResource } from "./VueStoreResource";

const camila = {
  id: 1,
  name: "Camila",
  age: 21,
  height: 1.54,
};

const deborah = {
  id: 2,
  name: "Deborah",
  age: 20,
  height: 1.59,
};

const resourceName = "users";

const store = new VueStore();

const rootState = Reflect.get(store, "store");

const resource = new VueStoreResource(resourceName, rootState);

const resourceState = rootState[resourceName];

describe("Resource", () => {
  test("set", () => {
    expect(resourceState.data[1]).toBe(undefined);
    expect(resourceState.data[2]).toBe(undefined);

    resource.set(1, camila);
    resource.set(2, deborah);

    expect(resourceState.data[1]).toEqual(camila);
    expect(resourceState.data[2]).toEqual(deborah);
  });

  test("get", () => {
    const resourceItem = resource.get(1);

    expect(resourceItem).toEqual(camila);
  });

  test("getAll", () => {
    const resourceCollection = resource.getAll();

    expect(resourceCollection).toEqual([camila, deborah]);
  });

  test("setProperty", () => {
    expect(resourceState.data[1].past).toBe(undefined);

    resource.setProperty(1, "past", 1);

    expect(resourceState.data[1].past).toBe(1);
  });

  test("has", () => {
    expect(resource.has(1)).toBe(true);
    expect(resource.has(2)).toBe(true);
    expect(resource.has(3)).toBe(false);
  });

  test("delete", () => {
    expect(resourceState.data[1]).not.toBe(undefined);

    resource.delete(1);

    expect(resourceState.data[1]).toBe(undefined);
  });

  test("clear", () => {
    expect(resourceState.data).not.toEqual({});

    resource.clear();

    expect(resourceState.data).toEqual({});
  });
});
