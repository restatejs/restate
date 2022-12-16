import type { CollectionResource } from "./CollectionResource";
import { useCollectionResource } from "./useCollectionResource";

interface UserResponse {
  id: number;
  name: string;
  age: number;
  height: number;
  past?: boolean;
}

interface UserEntity extends UserResponse {
  agePlus2: number;
}

const camila: UserResponse = {
  id: 1,
  name: "Camila",
  age: 21,
  height: 1.54,
};

const deborah: UserResponse = {
  id: 2,
  name: "Deborah",
  age: 20,
  height: 1.59,
};

describe("CollectionResource", () => {
  let resource: CollectionResource<UserEntity, UserResponse>;

  let plus2: (num: number) => number;
  let toMatchUserEntity: (
    expectedUser: { value: UserEntity | undefined },
    responseUser: UserResponse
  ) => void;

  beforeAll(() => {
    resource = useCollectionResource<UserEntity, UserResponse>({
      primaryKey: "id",
      computedProperties: {
        agePlus2: (item) => plus2(item.age),
      },
    });

    plus2 = (num) => num + 2;
    toMatchUserEntity = (expectedUser, responseUser) => {
      expect(expectedUser.value).toMatchObject(responseUser);
      expect(expectedUser.value).toHaveProperty(
        "agePlus2",
        expectedUser.value && plus2(expectedUser.value.age)
      );
    };
  });

  beforeEach(() => {
    resource.clear();
  });

  test("should be able to execute the get function", () => {
    const item = resource.get(camila.id);
    expect(item.value).toBe(undefined);

    resource.set(camila.id, { ...camila });

    const settedItem = resource.get(camila.id);

    [item, settedItem].forEach((target) => {
      expect(target.value).toMatchObject(camila);
      expect(target.value).toHaveProperty(
        "agePlus2",
        target.value && plus2(target.value.age)
      );
    });
  });

  test("should be able to execute the getAll function", () => {
    const items = resource.getAll();
    expect(items.value).toEqual([]);

    const users = [{ ...camila }, { ...deborah }];
    resource.setAll(users);

    const settedItems = resource.getAll();

    [items, settedItems].forEach((targets) => {
      targets.value.forEach((item, i) =>
        toMatchUserEntity({ value: item.data }, users[i])
      );
    });
  });

  test("should be able to execute the set function", () => {
    const items = resource.getAll();
    expect(items.value.length).toBe(0);

    const item = resource.get(camila.id);
    expect(item.value).toBe(undefined);

    resource.set(camila.id, { ...camila });

    expect(items.value.length).toBe(1);
    toMatchUserEntity(item, camila);
  });

  test("should be able to execute the setAll function", () => {
    const items = resource.getAll();
    expect(items.value.length).toBe(0);

    const itemA = resource.get(camila.id);
    const itemB = resource.get(deborah.id);

    expect(itemA.value).toBe(undefined);
    expect(itemB.value).toBe(undefined);

    resource.setAll([camila, deborah]);

    expect(items.value.length).toBe(2);

    toMatchUserEntity(itemA, camila);
    toMatchUserEntity(itemB, deborah);

    toMatchUserEntity(resource.get(camila.id), camila);
    toMatchUserEntity(resource.get(deborah.id), deborah);
  });

  test("should be able to execute the setProperty function", () => {
    resource.set(camila.id, { ...camila });

    const item = resource.get(camila.id);

    expect(item.value?.past).toBe(undefined);

    resource.setProperty(camila.id, "past", true);

    expect(item.value?.past).toBe(true);

    expect(() => resource.setProperty(deborah.id, "past", true)).toThrow();
  });

  test("should be able to execute the has function", () => {
    expect(resource.has(camila.id)).toBe(false);

    resource.set(camila.id, camila);

    expect(resource.has(camila.id)).toBe(true);
  });

  test("should be able to execute the delete function", () => {
    resource.set(camila.id, camila);
    const item = resource.get(camila.id);
    const items = resource.getAll();

    expect(item.value).not.toBe(undefined);

    resource.delete(camila.id);

    expect(item.value).toBe(undefined);
    expect(resource.get(camila.id).value).toBe(undefined);

    expect(items.value).toEqual([]);
    expect(resource.getAll().value).toEqual([]);
  });

  test("should be able to execute the clear function", () => {
    const users = [{ ...camila }, { ...deborah }];
    resource.setAll(users);

    const items = resource.getAll();
    const itemA = resource.get(camila.id);
    const itemB = resource.get(deborah.id);

    items.value.forEach((item, i) =>
      toMatchUserEntity({ value: item.data }, users[i])
    );
    toMatchUserEntity(itemA, camila);
    toMatchUserEntity(itemB, deborah);

    resource.clear();

    expect(items.value).toEqual([]);
    expect(itemA.value).toBe(undefined);
    expect(itemB.value).toBe(undefined);

    expect(resource.getAll().value).toEqual([]);
    expect(resource.get(camila.id).value).toBe(undefined);
    expect(resource.get(deborah.id).value).toBe(undefined);
  });
});
