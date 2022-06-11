import axios from "axios";

import { BaseModel } from "./BaseModel";

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

const UsersModel = new BaseModel<User>("users", mockedAxios);

describe("BaseModel", () => {
  test("item", async () => {
    UsersModel.$resource.set(1, camila);

    expect(UsersModel.item(1).value).toEqual(camila);
  });

  test("collection", async () => {
    expect(UsersModel.collection.value).toEqual([camila]);
  });

  test("index", async () => {
    UsersModel.$resource.clear();

    mockedAxios.get.mockImplementation(() =>
      Promise.resolve({ data: usersList })
    );

    expect(UsersModel.$resource.getAll().value).toEqual([]);

    const { load, data } = UsersModel.index();

    expect(data.value).toEqual([]);

    await load;

    expect(UsersModel.$resource.getAll().value).toEqual(usersList);

    expect(data.value).toEqual(usersList);
  });

  test("show", async () => {
    UsersModel.$resource.clear();

    mockedAxios.get.mockImplementation(() => Promise.resolve({ data: camila }));

    expect(UsersModel.$resource.get(1).value).toEqual({});

    const { load, data } = UsersModel.show(1);

    expect(data.value).toEqual({});

    await load;

    expect(UsersModel.$resource.get(1).value).toEqual(camila);

    expect(data.value).toEqual(camila);
  });

  test("store", async () => {
    mockedAxios.post.mockImplementation(() =>
      Promise.resolve({ data: deborah })
    );

    expect(UsersModel.$resource.get(2).value).toEqual({});

    const stored = await UsersModel.store(deborah);

    expect(stored).toBe(true);
    expect(UsersModel.$resource.get(2).value).toEqual(deborah);
  });

  test("update", async () => {
    expect(UsersModel.$resource.get(1)?.value.age).toBe(camila.age);

    const updated = await UsersModel.update(camila.id, { age: 22 });

    expect(updated).toBe(true);
    expect(UsersModel.$resource.get(1)?.value.age).toBe(22);
  });

  test("destroy", async () => {
    expect(UsersModel.$resource.get(2).value).toEqual(deborah);

    const destroyed = await UsersModel.destroy(deborah.id);

    expect(destroyed).toBe(true);
    expect(UsersModel.$resource.get(2).value).toEqual({});
  });
});
