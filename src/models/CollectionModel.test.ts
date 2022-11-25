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
  age: number;
  height: number;
  agePlus2: number;
}

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("models/CollectionModel", () => {
  let resourceName: string;
  let collectionModel: CollectionModel<UserEntity, UserResponse>;
  let resource: Resource<UserEntity>;

  let itemA: () => UserResponse;
  let itemB: () => UserResponse;
  let usersList: () => UserResponse[];
  let originalItem: (id: UserResponse["id"]) => UserResponse;

  let plus2: (num: number) => number;
  let addMeter: (val: number | string) => string;

  beforeAll(() => {
    resourceName = "user";
    collectionModel = new CollectionModel<UserEntity, UserResponse>({
      primaryKey: "id",
      resourceName,
      axios: mockedAxios,
      computedProperties: {
        agePlus2: (item) => item.value.age + 2,
      },
      mapAfterRequest: (item) => {
        item.height = addMeter(item.height) as any;

        return item;
      },
    });

    resource = Reflect.get(collectionModel, "$resource");

    itemA = () => ({
      id: 1,
      name: "Camila",
      age: 21,
      height: 1.54,
    });
    itemB = () => ({
      id: 2,
      name: "Deborah",
      age: 20,
      height: 1.59,
    });
    usersList = () => [itemA(), itemB()];
    originalItem = (id) => {
      const item = usersList().find((item) => item.id === id);

      return item!;
    };

    plus2 = (num) => num + 2;
    addMeter = (val) => `${val} m`;
  });

  beforeEach(() => {
    resource.clear();
  });

  test("should be able to execute the index function", async () => {
    mockedAxios.request.mockImplementation(async () => ({
      data: usersList(),
    }));

    const { data, loaded } = collectionModel.index();

    expect(data.value).toEqual([]);

    await loaded;

    data.value.forEach((item) => {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("name");
      expect(item).toHaveProperty("age");
      expect(item).toHaveProperty(
        "height",
        addMeter(originalItem(item.id).height)
      );
      expect(item).toHaveProperty("agePlus2", plus2(item.age));
    });
  });

  test("should be able to execute the show function", async () => {
    mockedAxios.request.mockImplementation(async () => ({
      data: itemA(),
    }));

    const { data, loaded } = collectionModel.show(1);

    expect(data.value).toBe(undefined);

    await loaded;

    expect(data.value).toHaveProperty("id");
    expect(data.value).toHaveProperty("name");
    expect(data.value).toHaveProperty("age");
    expect(data.value).toHaveProperty("height", addMeter(itemA().height));
    expect(data.value).toHaveProperty(
      "agePlus2",
      data.value ? plus2(data.value.age) : null
    );
  });

  test("should be able to execute the store function", async () => {
    mockedAxios.request.mockImplementation(async () => ({
      data: itemB(),
    }));

    const { data, loaded } = collectionModel.store(itemB);

    expect(data.value).toBe(undefined);

    await loaded;

    expect(data.value).toHaveProperty("id");
    expect(data.value).toHaveProperty("name");
    expect(data.value).toHaveProperty("age");
    expect(data.value).toHaveProperty("height", addMeter(itemB().height));
    expect(data.value).toHaveProperty(
      "agePlus2",
      data.value ? plus2(data.value.age) : null
    );
  });

  test("should be able to execute the update function", async () => {
    mockedAxios.request.mockImplementation(async () => ({
      data: usersList(),
    }));

    await collectionModel.index();

    const refUser = collectionModel.item(1);

    expect(refUser.value?.age).toBe(itemA().age);
    expect(refUser.value).toHaveProperty(
      "agePlus2",
      refUser.value ? plus2(refUser.value.age) : null
    );

    const newAge = 22;
    const { loaded } = collectionModel.update(itemA().id, { age: newAge });

    await loaded;

    expect(refUser.value?.age).toBe(newAge);
    expect(refUser.value).toHaveProperty("agePlus2", plus2(newAge));
  });

  test("should be able to execute the destroy function", async () => {
    mockedAxios.request.mockImplementation(async () => ({
      data: usersList(),
    }));

    await collectionModel.index();

    expect(collectionModel.item(2).value).not.toBe(undefined);

    const { loaded } = collectionModel.destroy(itemB().id);

    await loaded;

    expect(collectionModel.item(2).value).toBe(undefined);
  });

  test("should be able to execute the item function", async () => {
    mockedAxios.request.mockImplementation(async () => ({
      data: usersList(),
    }));

    await collectionModel.index();

    const refUser = collectionModel.item(1);

    expect(refUser.value).toHaveProperty("id");
    expect(refUser.value).toHaveProperty("name");
    expect(refUser.value).toHaveProperty("age");
    expect(refUser.value).toHaveProperty("height", addMeter(itemA().height));
    expect(refUser.value).toHaveProperty(
      "agePlus2",
      refUser.value ? refUser.value.age + 2 : null
    );
  });

  test("should be able to execute the data function", async () => {
    mockedAxios.request.mockImplementation(async () => ({
      data: usersList(),
    }));

    await collectionModel.index();

    const data = collectionModel.data();

    data.value.forEach((item) => {
      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("name");
      expect(item).toHaveProperty("age");
      expect(item).toHaveProperty(
        "height",
        addMeter(originalItem(item.id).height)
      );
      expect(item).toHaveProperty("agePlus2", item ? plus2(item.age) : null);
    });
  });
});
