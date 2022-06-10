import { Resource } from "./Resource";

interface User {
  id: number;
  name: string;
  age: number;
  height: number;
  past?: number;
}

const camila: User = {
  id: 1,
  name: "Camila",
  age: 21,
  height: 1.54,
};

const deborah: User = {
  id: 2,
  name: "Deborah",
  age: 20,
  height: 1.59,
};

const resource = new Resource<User>();

const state: { data: Record<string, Partial<User>> } = Reflect.get(
  resource,
  "state"
);

describe("Resource", () => {
  test("set", () => {
    expect(state.data[1]).toBe(undefined);
    expect(state.data[2]).toBe(undefined);

    resource.set(1, camila);
    resource.set(2, deborah);

    expect(state.data[1]).toEqual(camila);
    expect(state.data[2]).toEqual(deborah);
  });

  test("get", () => {
    const resourceItem = resource.get(1).value;

    expect(resourceItem).toEqual(camila);
  });

  test("getAll", () => {
    const resourceCollection = resource.getAll().value;

    expect(resourceCollection).toEqual([camila, deborah]);
  });

  test("setProperty", () => {
    expect(state.data[1].past).toBe(undefined);

    resource.setProperty(1, "past", 1);

    expect(state.data[1].past).toBe(1);
  });

  test("has", () => {
    expect(resource.has(1)).toBe(true);
    expect(resource.has(2)).toBe(true);
    expect(resource.has(3)).toBe(false);
  });

  test("delete", () => {
    expect(state.data[1]).not.toBe(undefined);

    resource.delete(1);

    expect(state.data[1]).toBe(undefined);
  });

  test("clear", () => {
    expect(state.data).not.toEqual({});

    resource.clear();

    expect(state.data).toEqual({});
  });
});
