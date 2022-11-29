import type { ResourceCollectionState } from "types/resources/CollectionResource";

import { CollectionResource } from "./CollectionResource";

interface User {
  id: number;
  name: string;
  age: number;
  height: number;
  past?: boolean;
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

describe("CollectionResource", () => {
  let resource: CollectionResource<User, "id">;
  let state: ResourceCollectionState<User, "id">;

  beforeAll(() => {
    resource = new CollectionResource<User, "id">();

    state = Reflect.get(resource, "state");
  });

  beforeEach(() => {
    resource.clear();
  });

  test("should be able to execute the get function", () => {
    expect(resource.get(1).value).toBe(undefined);

    resource.set(1, camila);

    expect(resource.get(1).value).toEqual(camila);
  });

  test("should be able to execute the set function", () => {
    expect(state.data[1]).toBe(undefined);

    const refCamila = resource.set(1, camila);

    expect(state.data[1]).toEqual(refCamila.value);
    expect(state.data[1]).toEqual(camila);
  });

  test("should be able to execute the getAll function", () => {
    resource.set(1, camila);
    resource.set(2, deborah);

    const resourceCollection = resource.getAll().value;

    expect(resourceCollection).toEqual([camila, deborah]);
  });

  test("should be able to execute the setProperty function", () => {
    resource.set(1, { ...camila });

    expect(state.data[1]?.past).toBe(undefined);

    resource.setProperty(1, "past", true);

    expect(state.data[1]?.past).toBe(true);

    expect(() => resource.setProperty(2, "past", true)).toThrow();
  });

  test("should be able to execute the has function", () => {
    expect(resource.has(1)).toBe(false);

    resource.set(1, camila);

    expect(resource.has(1)).toBe(true);
  });

  test("should be able to execute the delete function", () => {
    resource.set(1, camila);

    expect(state.data[1]).not.toBe(undefined);

    resource.delete(1);

    expect(state.data[1]).toBe(undefined);
  });

  test("should be able to execute the clear function", () => {
    resource.set(1, camila);

    expect(state.data).not.toEqual({});

    resource.clear();

    expect(state.data).toEqual({});
  });
});
