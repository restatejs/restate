import type { ItemResource } from "./ItemResource";
import { useItemResource } from "./useItemResource";

interface UserResponse {
  name: string;
  age: number;
  height: number;
  past?: boolean;
}

interface UserEntity extends UserResponse {
  agePlus2: number;
}

describe("ItemResource", () => {
  let resource: ItemResource<UserEntity, UserResponse>;

  let createItem: () => UserResponse;

  let plus2: (num: number) => number;
  let toMatchUserEntity: (
    expectedUser: { value: UserEntity | undefined },
    responseUser: UserResponse
  ) => void;

  beforeAll(() => {
    resource = useItemResource<UserEntity, UserResponse>({
      computedProperties: {
        agePlus2: (item) => plus2(item.age),
      },
    });

    createItem = () => ({
      name: "Camila",
      age: 21,
      height: 1.54,
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
    const item = resource.get();

    resource.set(createItem());

    toMatchUserEntity(item, createItem());
    toMatchUserEntity(resource.get(), createItem());
  });

  test("should be able to execute the set function", () => {
    resource.set(createItem());

    toMatchUserEntity(resource.get(), createItem());
  });

  test("should be able to execute the setProperty function", () => {
    const item = resource.get();

    resource.set(createItem());

    expect(item.value?.past).toBe(undefined);

    resource.setProperty("past", true);

    expect(item.value?.past).toBe(true);

    resource.clear();

    expect(() => resource.setProperty("past", true)).toThrow();
  });

  test("should be able to execute the has function", () => {
    expect(resource.has()).toBe(false);

    resource.set(createItem());

    expect(resource.has()).toBe(true);
  });

  test("should be able to execute the clear function", () => {
    const item = resource.get();

    resource.set(createItem());

    expect(item.value).not.toEqual(undefined);

    resource.clear();

    expect(item.value).toEqual(undefined);
  });
});
