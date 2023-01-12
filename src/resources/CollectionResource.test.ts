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
    expectedUser: UserEntity | undefined,
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
      expect(expectedUser).toMatchObject(responseUser);
      expect(expectedUser).toHaveProperty(
        "agePlus2",
        expectedUser && plus2(expectedUser.age)
      );
    };
  });

  beforeEach(() => {
    resource.clear();
  });

  test("should be able to execute the get function", () => {
    expect(resource.get(camila.id)).toBe(undefined);

    resource.set(camila.id, { ...camila });

    const settedItem = resource.get(camila.id);

    expect(settedItem).toMatchObject(camila);
    expect(settedItem).toHaveProperty(
      "agePlus2",
      settedItem && plus2(settedItem.age)
    );
  });

  test("should be able to execute the getAll function", () => {
    const items = resource.getAll();
    expect(items.value).toEqual([]);

    const users = [{ ...camila }, { ...deborah }];
    resource.setAll(users);

    const settedItems = resource.getAll();

    [items, settedItems].forEach((targets) => {
      targets.value.forEach((item, i) => toMatchUserEntity(item, users[i]));
    });
  });

  test("should be able to execute the set function", () => {
    const items = resource.getAll();
    expect(items.value.length).toBe(0);

    expect(resource.get(camila.id)).toBe(undefined);

    resource.set(camila.id, { ...camila });

    expect(items.value.length).toBe(1);
    toMatchUserEntity(resource.get(camila.id), camila);
  });

  test("should be able to execute the setAll function", () => {
    const items = resource.getAll();
    expect(items.value.length).toBe(0);

    expect(resource.get(camila.id)).toBe(undefined);
    expect(resource.get(deborah.id)).toBe(undefined);

    resource.setAll([camila, deborah]);

    expect(items.value.length).toBe(2);

    toMatchUserEntity(resource.get(camila.id), camila);
    toMatchUserEntity(resource.get(deborah.id), deborah);
  });

  test("should be able to execute the setProperty function", () => {
    resource.set(camila.id, { ...camila });

    const item = resource.get(camila.id);

    expect(item?.past).toBe(undefined);

    resource.setProperty(camila.id, "past", true);

    expect(item?.past).toBe(true);

    expect(() => resource.setProperty(deborah.id, "past", true)).toThrow();
  });

  test("should be able to execute the has function", () => {
    expect(resource.has(camila.id)).toBe(false);

    resource.set(camila.id, camila);

    expect(resource.has(camila.id)).toBe(true);
  });

  test("should be able to execute the delete function", () => {
    resource.set(camila.id, camila);
    const items = resource.getAll();

    expect(resource.get(camila.id)).not.toBe(undefined);

    resource.delete(camila.id);

    expect(resource.get(camila.id)).toBe(undefined);
    expect(resource.get(camila.id)).toBe(undefined);

    expect(items.value).toEqual([]);
    expect(resource.getAll().value).toEqual([]);
  });

  test("should be able to execute the clear function", () => {
    const users = [{ ...camila }, { ...deborah }];
    resource.setAll(users);

    const items = resource.getAll();

    items.value.forEach((item, i) => toMatchUserEntity(item, users[i]));
    toMatchUserEntity(resource.get(camila.id), camila);
    toMatchUserEntity(resource.get(deborah.id), deborah);

    resource.clear();

    expect(items.value).toEqual([]);

    expect(resource.getAll().value).toEqual([]);
    expect(resource.get(camila.id)).toBe(undefined);
    expect(resource.get(deborah.id)).toBe(undefined);
  });
});
