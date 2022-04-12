import { BaseModel, IHTTPClient, IStore } from "types";

import { Restate } from "@/Restate";

const httpClient = {} as IHTTPClient;

const store = {} as IStore;

const restate = new Restate(httpClient, store);

const usersModel = {} as BaseModel<any>;

const $models = Reflect.get(restate, "$models") as Restate["$models"];

describe("Restate", () => {
  test("set", () => {
    expect($models.get("users")).toBe(undefined);

    restate.set("users", usersModel);

    expect($models.get("users")).toBe(usersModel);
  });

  test("get", () => {
    expect(restate.get("users")).toBe(usersModel);
  });

  test("entries", () => {
    const restateObject = Object.fromEntries(restate.entries());

    const modelsObject = Object.fromEntries($models.entries());

    expect(restateObject).toEqual(modelsObject);
  });

  test("has", () => {
    expect(restate.has("users")).toBe(true);
    expect(restate.has("customers")).toBe(false);
  });

  test("delete", () => {
    expect($models.get("users")).toBe(usersModel);

    expect(restate.delete("users")).toBe(true);

    expect($models.get("users")).toBe(undefined);
  });

  test("clear", () => {
    restate.set("users", usersModel);
    expect($models.get("users")).toBe(usersModel);

    let restateObject = Object.fromEntries(restate.entries());
    expect(restateObject).not.toEqual({});

    restate.clear();

    restateObject = Object.fromEntries(restate.entries());
    expect(restateObject).toEqual({});
  });
});
