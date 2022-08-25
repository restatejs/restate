import axios from "axios";

import { CollectionModel } from "./CollectionModel";

interface User {
  id: number;
  name: string;
  age: number;
  height: number;
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

const usersList = [camila, deborah];

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

const UsersModel = new CollectionModel<User>("users", mockedAxios);

describe("CollectionModel", () => {
  test("item", async () => {
    UsersModel.$resource.set(1, camila);

    expect(UsersModel.item(1).value).toEqual(camila);
  });

  test("data", async () => {
    expect(UsersModel.data().value).toEqual([camila]);
  });

  test("index", async () => {
    UsersModel.$resource.clear();

    mockedAxios.get.mockImplementation(() =>
      Promise.resolve({ data: usersList })
    );

    expect(UsersModel.$resource.getAll().value).toEqual([]);

    const { data, loaded, loading } = UsersModel.index();

    expect(data.value).toEqual([]);

    expect(loading.value).toBe(true);

    await loaded;

    expect(loading.value).toBe(false);

    expect(UsersModel.$resource.getAll().value).toEqual(usersList);

    expect(data.value).toEqual(usersList);
  });

  test("show", async () => {
    UsersModel.$resource.clear();

    mockedAxios.get.mockImplementation(() => Promise.resolve({ data: camila }));

    expect(UsersModel.$resource.get(1).value).toEqual({});

    const { data, loaded, loading } = UsersModel.show(1);

    expect(data.value).toEqual({});

    expect(loading.value).toBe(true);

    await loaded;

    expect(loading.value).toBe(false);

    expect(UsersModel.$resource.get(1).value).toEqual(camila);

    expect(data.value).toEqual(camila);
  });

  test("store", async () => {
    mockedAxios.post.mockImplementation(() =>
      Promise.resolve({ data: deborah })
    );

    expect(UsersModel.$resource.get(2).value).toEqual({});

    const { data, loaded, loading } = UsersModel.store(deborah);

    expect(data.value).toBe(null);

    expect(loading.value).toBe(true);

    await loaded;

    expect(loading.value).toBe(false);

    expect(data.value).toEqual(deborah);

    expect(UsersModel.$resource.get(2).value).toEqual(deborah);
  });

  test("update", async () => {
    expect(UsersModel.$resource.get(1)?.value.age).toBe(camila.age);

    const { loaded, loading } = UsersModel.update(camila.id, { age: 22 });

    expect(loading.value).toBe(true);

    await loaded;

    expect(loading.value).toBe(false);

    expect(UsersModel.$resource.get(1)?.value.age).toBe(22);
  });

  test("destroy", async () => {
    expect(UsersModel.$resource.get(2).value).toEqual(deborah);

    const { loaded, loading } = UsersModel.destroy(deborah.id);

    expect(loading.value).toBe(true);

    await loaded;

    expect(loading.value).toBe(false);

    expect(UsersModel.$resource.get(2).value).toEqual({});
  });
});
