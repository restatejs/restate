import axios from "axios";

import { ItemModel } from "./ItemModel";

interface User {
  name: string;
  age: number;
  height: number;
}

const camila: User = {
  name: "Camila",
  age: 21,
  height: 1.54,
};

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

const UsersModel = new ItemModel<User>("user", mockedAxios);

describe("ItemModel", () => {
  test("data", async () => {
    UsersModel.$resource.set("user", camila);

    expect(UsersModel.data().value).toEqual(camila);
  });

  test("show", async () => {
    UsersModel.$resource.clear();

    mockedAxios.get.mockImplementation(() => Promise.resolve({ data: camila }));

    expect(UsersModel.$resource.get("user").value).toEqual({});

    const { data, loaded, loading } = UsersModel.show();

    expect(data.value).toEqual({});

    expect(loading.value).toBe(true);

    await loaded;

    expect(loading.value).toBe(false);

    expect(UsersModel.$resource.get("user").value).toEqual(camila);

    expect(data.value).toEqual(camila);
  });

  test("update", async () => {
    expect(UsersModel.$resource.get("user")?.value.age).toBe(camila.age);

    const { loaded, loading } = UsersModel.update({ age: 22 });

    expect(loading.value).toBe(true);

    await loaded;

    expect(loading.value).toBe(false);

    expect(UsersModel.$resource.get("user")?.value.age).toBe(22);
  });
});
