import type { ResourceItemState } from "types/resources/ItemResource";

import { ItemResource } from "./ItemResource";

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

describe("ItemResource", () => {
  let resource: ItemResource<User>;
  let state: ResourceItemState<User>;

  beforeAll(() => {
    resource = new ItemResource<User>();
    state = Reflect.get(resource, "state");
  });

  beforeEach(() => {
    resource.clear();
  });

  test("should be able to execute the get function", () => {
    expect(resource.get().value).toBe(undefined);

    resource.set(camila);

    expect(resource.get().value).toEqual(camila);
  });

  test("should be able to execute the set function", () => {
    expect(state.value).toBe(undefined);

    const refCamila = resource.set(camila);

    expect(state.value).toEqual(refCamila.value);
    expect(state.value).toEqual(camila);
  });

  test("should be able to execute the setProperty function", () => {
    resource.set({ ...camila });

    expect(state.value?.past).toBe(undefined);

    resource.setProperty("past", true);

    expect(state.value?.past).toBe(true);

    resource.clear();

    expect(() => resource.setProperty("past", true)).toThrow();
  });

  test("should be able to execute the has function", () => {
    expect(resource.has()).toBe(false);

    resource.set(camila);

    expect(resource.has()).toBe(true);
  });

  test("should be able to execute the clear function", () => {
    resource.set(camila);

    expect(state.value).not.toEqual(undefined);

    resource.clear();

    expect(state.value).toEqual(undefined);
  });
});
