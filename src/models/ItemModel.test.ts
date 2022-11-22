import axios from "axios";

import type { Resource } from "..";

import { ItemModel } from "./ItemModel";

interface UserResponse {
  name: string;
  age: number;
  height: number;
}

interface UserEntity {
  name: string;
  age: number;
  height: number;
  agePlus2: number;
}

const camila: UserResponse = {
  name: "Camila",
  age: 21,
  height: 1.54,
};

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("models/ItemModel", () => {
  let resourceName: string;
  let itemModel: ItemModel<UserEntity>;
  let resource: Resource<UserEntity>;

  beforeAll(() => {
    resourceName = "user";
    itemModel = new ItemModel<UserEntity>({
      resourceName,
      axios: mockedAxios,
      computedProperties: {
        agePlus2: (item) => item.value.age + 2,
      },
    });
    resource = Reflect.get(itemModel, "$resource");
  });

  test("should be able to execute the show function", async () => {
    resource.clear();

    mockedAxios.request.mockImplementation(async () => ({ data: camila }));

    const { data, loaded } = itemModel.show();

    expect(data.value).toEqual(undefined);

    await loaded;

    expect(data.value).toHaveProperty("name", camila.name);
    expect(data.value).toHaveProperty("age", camila.age);
    expect(data.value).toHaveProperty("height", camila.height);
    expect(data.value).toHaveProperty("agePlus2", 23);
  });

  test("should be able to execute the update function", async () => {
    const data = resource.get(resourceName);

    expect(data.value?.age).toBe(camila.age);

    const { loaded } = itemModel.update({ age: 22 });

    await loaded;

    expect(data.value).toHaveProperty("age", 22);
    expect(data.value).toHaveProperty("agePlus2", 24);
  });

  test("should be able to execute the data function", async () => {
    const data = itemModel.data();

    expect(data.value).toHaveProperty("name", camila.name);
    expect(data.value).toHaveProperty("age", 22);
    expect(data.value).toHaveProperty("height", camila.height);
    expect(data.value).toHaveProperty("agePlus2", 24);
  });
});
