import axios from "axios";

import type { Resource } from "..";

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

describe("models/ItemModel", () => {
  let resourceName: string;
  let itemModel: ItemModel<User>;
  let resource: Resource<User>;

  beforeAll(() => {
    resourceName = "user";
    itemModel = new ItemModel<User>({ resourceName, axios: mockedAxios });
    resource = Reflect.get(itemModel, "$resource");
  });

  test("should be able to execute the data function", async () => {
    resource.set(resourceName, camila);

    expect(itemModel.data().value).toEqual(camila);
  });

  test("should be able to execute the show function", async () => {
    resource.clear();

    mockedAxios.request.mockImplementation(async () => ({ data: camila }));

    expect(resource.get(resourceName).value).toEqual({});

    const { data, loaded, loading } = itemModel.show();

    expect(data.value).toEqual({});

    expect(loading.value).toBe(true);

    await loaded;

    expect(loading.value).toBe(false);

    expect(resource.get(resourceName).value).toEqual(camila);

    expect(data.value).toEqual(camila);
  });

  test("should be able to execute the update function", async () => {
    expect(resource.get(resourceName)?.value.age).toBe(camila.age);

    const { loaded, loading } = itemModel.update({ age: 22 });

    expect(loading.value).toBe(true);

    await loaded;

    expect(loading.value).toBe(false);

    expect(resource.get(resourceName)?.value.age).toBe(22);
  });
});
