import axios from "axios";

import type { ItemResource } from "../resources/ItemResource";
import { ItemModel } from "./ItemModel";

interface UserEntity {
  name: string;
  age: number;
  height: string;
  agePlus2: number;
}

interface UserResponse {
  name: string;
  age: number;
  height: number;
}

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("models/ItemModel", () => {
  let resourceName: string;
  let itemModel: ItemModel<UserEntity, UserResponse>;
  let resource: ItemResource<UserEntity>;

  let itemA: () => UserResponse;

  let plus2: (num: number) => number;
  let addMeter: (val: number | string) => string;

  beforeAll(() => {
    resourceName = "user";
    itemModel = new ItemModel<UserEntity, UserResponse>({
      resourceName,
      axios: mockedAxios,
      computedProperties: {
        agePlus2: (item) => plus2(item.age),
      },
      mapAfterRequest: (item) => {
        item.height = addMeter(item.height) as any;

        return item;
      },
    });

    resource = Reflect.get(itemModel, "$resource");

    itemA = () => ({
      name: "Camila",
      age: 21,
      height: 1.54,
    });

    plus2 = (num) => num + 2;
    addMeter = (val) => `${val} m`;
  });

  beforeEach(() => {
    resource.clear();
  });

  test("should be able to execute the show function", async () => {
    mockedAxios.request.mockImplementation(async () => ({
      data: itemA(),
    }));

    const { data, loaded } = itemModel.show();

    expect(data.value).toEqual(undefined);

    await loaded;

    expect(data.value).toHaveProperty("name", itemA().name);
    expect(data.value).toHaveProperty("age", itemA().age);
    expect(data.value).toHaveProperty("height", addMeter(itemA().height));
    expect(data.value).toHaveProperty("agePlus2", plus2(itemA().age));
  });

  test("should be able to execute the update function", async () => {
    mockedAxios.request.mockImplementation(async () => ({
      data: itemA(),
    }));
    const { loaded: showLoaded, data } = itemModel.show();
    await showLoaded;

    expect(data.value?.age).toBe(itemA().age);

    const newAge = 22;

    const { loaded: updateLoaded } = itemModel.update({ age: newAge });
    await updateLoaded;

    expect(data.value).toHaveProperty("age", newAge);
    expect(data.value).toHaveProperty("agePlus2", plus2(newAge));
  });

  test("should be able to execute the data function", async () => {
    mockedAxios.request.mockImplementation(async () => ({
      data: itemA(),
    }));
    const { loaded: showLoaded } = itemModel.show();
    await showLoaded;

    const data = itemModel.data();

    expect(data.value).toHaveProperty("name", itemA().name);
    expect(data.value).toHaveProperty("age", itemA().age);
    expect(data.value).toHaveProperty("height", addMeter(itemA().height));
    expect(data.value).toHaveProperty("agePlus2", plus2(itemA().age));
  });
});
