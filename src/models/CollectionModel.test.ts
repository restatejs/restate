import axios from "axios";

import type { CollectionResource } from "../resources/CollectionResource";
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
  height: string;
  agePlus2: number;
}

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("models/CollectionModel", () => {
  let resourceName: string;
  let collectionModel: CollectionModel<UserEntity, UserResponse, "id">;
  let resource: CollectionResource<UserEntity, UserResponse, "id">;

  let itemA: () => UserResponse;
  let itemB: () => UserResponse;
  let usersList: () => UserResponse[];
  let originalItem: (id: UserResponse["id"]) => UserResponse;

  let plus2: (num: number) => number;
  let addMeter: (val: number | string) => string;

  beforeAll(() => {
    resourceName = "user";
    collectionModel = new CollectionModel<UserEntity, UserResponse, "id">({
      primaryKey: "id",
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

    const { loaded } = collectionModel.index();

    await loaded;

    const data = collectionModel.data();

    data.value.forEach((item) => {
      if (!item) throw new Error();

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

    const { loaded } = collectionModel.show(1);

    await loaded;

    const data = collectionModel.item(1);

    expect(data).toHaveProperty("id");
    expect(data).toHaveProperty("name");
    expect(data).toHaveProperty("age");
    expect(data).toHaveProperty("height", addMeter(itemA().height));
    expect(data).toHaveProperty("agePlus2", data ? plus2(data.age) : null);
  });

  test("should be able to execute the store function", async () => {
    mockedAxios.request.mockImplementation(async () => ({
      data: itemB(),
    }));

    const { loaded } = collectionModel.store(itemB());

    await loaded;

    const data = collectionModel.item(itemB().id);

    expect(data).toHaveProperty("id");
    expect(data).toHaveProperty("name");
    expect(data).toHaveProperty("age");
    expect(data).toHaveProperty("height", addMeter(itemB().height));
    expect(data).toHaveProperty("agePlus2", data ? plus2(data.age) : null);
  });

  test("should be able to execute the update function", async () => {
    mockedAxios.request.mockImplementation(async () => ({
      data: usersList(),
    }));

    await collectionModel.index();

    const refUser = collectionModel.item(1);

    expect(refUser?.age).toBe(itemA().age);
    expect(refUser).toHaveProperty(
      "agePlus2",
      refUser ? plus2(refUser.age) : null
    );

    const newAge = 22;
    const { loaded } = collectionModel.update(itemA().id, { age: newAge });

    await loaded;

    expect(refUser?.age).toBe(newAge);
    expect(refUser).toHaveProperty("agePlus2", plus2(newAge));
  });

  test("should be able to execute the destroy function", async () => {
    mockedAxios.request.mockImplementation(async () => ({
      data: usersList(),
    }));

    await collectionModel.index();

    expect(collectionModel.item(2)).not.toBe(undefined);

    const { loaded } = collectionModel.destroy(itemB().id);

    await loaded;

    expect(collectionModel.item(2)).toBe(undefined);
  });

  test("should be able to execute the item function", async () => {
    mockedAxios.request.mockImplementation(async () => ({
      data: usersList(),
    }));

    await collectionModel.index();

    const refUser = collectionModel.item(1);

    expect(refUser).toHaveProperty("id");
    expect(refUser).toHaveProperty("name");
    expect(refUser).toHaveProperty("age");
    expect(refUser).toHaveProperty("height", addMeter(itemA().height));
    expect(refUser).toHaveProperty(
      "agePlus2",
      refUser ? refUser.age + 2 : null
    );
  });

  test("should be able to execute the data function", async () => {
    mockedAxios.request.mockImplementation(async () => ({
      data: usersList(),
    }));

    await collectionModel.index();

    const data = collectionModel.data();
    data.value.forEach((item) => {
      if (!item) throw new Error();

      expect(item).toHaveProperty("id");
      expect(item).toHaveProperty("name");
      expect(item).toHaveProperty("age");
      expect(item).toHaveProperty(
        "height",
        addMeter(originalItem(item.id).height)
      );
      expect(item).toHaveProperty("agePlus2", item ? plus2(item.age) : null);
    });

    const sortedByAge = collectionModel.data({ sort: "age" });
    expect(sortedByAge.value[0]).toHaveProperty("name", itemB().name);
    expect(sortedByAge.value[1]).toHaveProperty("name", itemA().name);

    const sortedByHeight = collectionModel.data({ sort: "height" });
    expect(sortedByHeight.value[0]).toHaveProperty("name", itemA().name);
    expect(sortedByHeight.value[1]).toHaveProperty("name", itemB().name);

    const sortedByFunction = collectionModel.data({
      sort: (a, b) => (a?.age && b?.age ? a.age - b.age : 0),
    });
    expect(sortedByFunction.value[0]).toHaveProperty("name", itemB().name);
    expect(sortedByFunction.value[1]).toHaveProperty("name", itemA().name);

    const filterByAge = collectionModel.data({
      filter: (item) => (item?.age ? item.age <= 20 : false),
    });
    expect(filterByAge.value[0]).toHaveProperty("name", itemB().name);

    const filterByHeight = collectionModel.data({
      filter: (item) =>
        item?.height ? parseFloat(item.height) <= 1.55 : false,
    });
    expect(filterByHeight.value[0]).toHaveProperty("name", itemA().name);
  });
});
