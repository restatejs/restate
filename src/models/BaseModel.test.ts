import axios from "axios";

import { AxiosHTTPClient } from "@/implementations/httpClient/axios/AxiosHttpClient";
import { VueStore } from "@/implementations/store/vue/VueStore";
import { VueStoreResource } from "@/implementations/store/vue/VueStoreResource";

import { BaseModel } from "./BaseModel";

import Restate from "..";

const camila = {
  id: 1,
  name: "Camila",
  age: 21,
  height: 1.54,
};

const deborah = {
  id: 2,
  name: "Deborah",
  age: 20,
  height: 1.59,
};

const usersList = [camila, deborah];

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

const httpClient = new AxiosHTTPClient(mockedAxios);

const store = new VueStore();

const restate = new Restate(httpClient, store);

let UsersModel: BaseModel<{
  id: number;
  name: string;
  age: number;
  height: number;
}>;

describe("BaseModel", () => {
  test("new", () => {
    expect(restate.get("users")).toBe(undefined);
    expect(restate.store.get("users")).toBe(undefined);

    UsersModel = new BaseModel("users", restate);

    expect(restate.get("users")).toBe(UsersModel);
    expect(restate.store.get("users")).toBeInstanceOf(VueStoreResource);
    expect(() => new BaseModel("users", restate)).toThrow();
  });

  test("index", async () => {
    mockedAxios.get.mockImplementation(() =>
      Promise.resolve({ data: usersList })
    );

    expect(UsersModel.$resource.getAll()).toEqual([]);

    const users = await UsersModel.index();

    expect(users).toEqual(usersList);
    expect(UsersModel.$resource.getAll()).toEqual(usersList);
  });

  test("show", async () => {
    UsersModel.$resource.clear();

    mockedAxios.get.mockImplementation(() => Promise.resolve({ data: camila }));

    expect(UsersModel.$resource.get(1)).toBe(undefined);

    const user = await UsersModel.show(1);

    expect(user).toEqual(camila);
    expect(UsersModel.$resource.get(1)).toEqual(camila);
  });

  test("store", async () => {
    mockedAxios.post.mockImplementation(() =>
      Promise.resolve({ data: deborah })
    );

    expect(UsersModel.$resource.get(2)).toBe(undefined);

    const stored = await UsersModel.store(deborah);

    expect(stored).toBe(true);
    expect(UsersModel.$resource.get(2)).toEqual(deborah);
  });

  test("update", async () => {
    expect(UsersModel.$resource.get(1)?.age).toBe(camila.age);

    const updated = await UsersModel.update(camila.id, { age: 22 });

    expect(updated).toBe(true);
    expect(UsersModel.$resource.get(1)?.age).toBe(22);
  });

  test("destroy", async () => {
    expect(UsersModel.$resource.get(2)).toEqual(deborah);

    const destroyed = await UsersModel.destroy(deborah.id);

    expect(destroyed).toBe(true);
    expect(UsersModel.$resource.get(2)).toBe(undefined);
  });
});
