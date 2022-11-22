import axios from "axios";

import type { Resource } from "..";

import { CollectionModel } from "./CollectionModel";

interface UserResponse {
  id: number;
  name: string;
  age: number;
  height: number;
}

interface UserEntity {
  id: number;
  name: string;
  age: string;
  height: number;
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

const usersList = [camila, deborah];

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("models/CollectionModel", () => {
  let resourceName: string;
  let collectionModel: CollectionModel<UserEntity>;
  let resource: Resource<UserEntity>;

  beforeAll(() => {
    resourceName = "user";
    collectionModel = new CollectionModel<UserEntity>({
      primaryKey: "id",
      resourceName,
      axios: mockedAxios,
      computedProperties: {
        agePlus2: (item) => item.value.age + 2,
      },
    });
    resource = Reflect.get(collectionModel, "$resource");
  });

  // test("should be able to execute the item function", async () => {
  //   const refUser = resource.set(1, camila as any);

  //   expect(refUser.value).toEqual(collectionModel.item(1).value);
  //   expect(refUser.value).toEqual(camila);
  // });

  // test("should be able to execute the data function", async () => {
  //   expect(collectionModel.data().value).toEqual([camila]);
  // });

  test("should be able to execute the index function", async () => {
    resource.clear();

    mockedAxios.request.mockImplementation(async () => ({ data: usersList }));

    const computedUsersList = resource.getAll();

    expect(computedUsersList.value).toEqual([]);

    const { data, loaded } = collectionModel.index();

    expect(data.value).toEqual([]);

    await loaded;

    expect(data.value).toEqual(computedUsersList.value);

    data.value.forEach((item) => {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("name");
      expect(item).toHaveProperty("age");
      expect(item).toHaveProperty("height");
      expect(item).toHaveProperty("agePlus2", item.age + 2);
    });
  });

  test("should be able to execute the show function", async () => {
    resource.clear();

    mockedAxios.request.mockImplementation(async () => ({ data: camila }));

    const refUser = resource.get(1);

    expect(refUser.value).toBe(undefined);

    const { data, loaded } = collectionModel.show(1);

    expect(data.value).toBe(undefined);

    await loaded;

    expect(data.value).toEqual(refUser.value);

    expect(data.value).toHaveProperty("id");
    expect(data.value).toHaveProperty("name");
    expect(data.value).toHaveProperty("age");
    expect(data.value).toHaveProperty("height");
    expect(data.value).toHaveProperty(
      "agePlus2",
      data.value ? data.value.age + 2 : null
    );
  });

  test("should be able to execute the store function", async () => {
    mockedAxios.request.mockImplementation(async () => ({ data: deborah }));

    const refUser = resource.get(2);

    expect(refUser.value).toBe(undefined);

    const { data, loaded } = collectionModel.store(deborah);

    expect(data.value).toBe(undefined);

    await loaded;

    expect({ ...data.value }).toEqual({ ...refUser.value });

    expect(data.value).toHaveProperty("id");
    expect(data.value).toHaveProperty("name");
    expect(data.value).toHaveProperty("age");
    expect(data.value).toHaveProperty("height");
    expect(data.value).toHaveProperty(
      "agePlus2",
      data.value ? data.value.age + 2 : null
    );
  });

  test("should be able to execute the update function", async () => {
    resource.set(1, camila as any);

    const refUser = resource.get(1);

    expect(refUser.value?.age).toBe(camila.age);
    expect(refUser.value).toHaveProperty(
      "agePlus2",
      refUser.value ? refUser.value.age + 2 : null
    );

    const { loaded } = collectionModel.update(camila.id, { age: 22 });

    await loaded;

    expect(refUser.value?.age).toBe(22);
    expect(refUser.value).toHaveProperty("agePlus2", 24);
  });

  test("should be able to execute the destroy function", async () => {
    expect(resource.get(2).value).not.toBe(undefined);

    const { loaded } = collectionModel.destroy(deborah.id);

    await loaded;

    expect(resource.get(2).value).toBe(undefined);
  });
});
