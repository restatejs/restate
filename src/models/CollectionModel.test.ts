import axios from "axios";

import type { Resource } from "..";

import { CollectionModel } from "./CollectionModel";
import type { ItemModel } from "./ItemModel";

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
    });
    resource = Reflect.get(collectionModel, "$resource");
  });

  test("should be able to execute the item function", async () => {
    resource.set(1, camila as any);

    expect(collectionModel.item(1).value).toEqual(camila);
  });

  test("should be able to execute the data function", async () => {
    expect(collectionModel.data().value).toEqual([camila]);
  });

  test("should be able to execute the index function", async () => {
    resource.clear();

    mockedAxios.request.mockImplementation(async () => ({ data: usersList }));

    expect(resource.getAll().value).toEqual([]);

    const { data, loaded, loading } = collectionModel.index();

    expect(data.value).toEqual([]);

    expect(loading.value).toBe(true);

    await loaded;

    expect(loading.value).toBe(false);

    expect(resource.getAll().value).toEqual(usersList);

    expect(data.value).toEqual(usersList);
  });

  test("should be able to execute the show function", async () => {
    resource.clear();

    mockedAxios.request.mockImplementation(async () => ({ data: camila }));

    expect(resource.get(1).value).toEqual({});

    const { data, loaded, loading } = collectionModel.show(1);

    expect(data.value).toEqual({});

    expect(loading.value).toBe(true);

    await loaded;

    expect(loading.value).toBe(false);

    expect(resource.get(1).value).toEqual(camila);

    expect(data.value).toEqual(camila);
  });

  test("should be able to execute the store function", async () => {
    mockedAxios.request.mockImplementation(async () => ({ data: deborah }));

    expect(resource.get(2).value).toEqual({});

    const { data, loaded, loading } = collectionModel.store(deborah);

    expect(data.value).toBe(null);

    expect(loading.value).toBe(true);

    await loaded;

    expect(loading.value).toBe(false);

    expect(data.value).toEqual(deborah);

    expect(resource.get(2).value).toEqual(deborah);
  });

  test("should be able to execute the update function", async () => {
    resource.set(1, camila as any);

    expect(resource.get(1)?.value.age).toBe(camila.age);

    const { loaded, loading } = collectionModel.update(camila.id, { age: 22 });

    expect(loading.value).toBe(true);

    await loaded;

    expect(loading.value).toBe(false);

    expect(resource.get(1)?.value.age).toBe(22);
  });

  test("should be able to execute the destroy function", async () => {
    expect(resource.get(2).value).toEqual(deborah);

    const { loaded, loading } = collectionModel.destroy(deborah.id);

    expect(loading.value).toBe(true);

    await loaded;

    expect(loading.value).toBe(false);

    expect(resource.get(2).value).toEqual({});
  });
});
