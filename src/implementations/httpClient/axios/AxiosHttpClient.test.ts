import axios from "axios";

import { AxiosHTTPClient } from "./AxiosHttpClient";

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

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

const axiosHTTPClient = new AxiosHTTPClient(mockedAxios);

describe("AxiosHTTPClient", () => {
  test("get", async () => {
    mockedAxios.get.mockImplementation(() =>
      Promise.resolve({ data: [camila, deborah] })
    );

    const data = await axiosHTTPClient.get("/users");

    expect(data).toEqual([camila, deborah]);
  });

  test("post", async () => {
    mockedAxios.post.mockImplementation(() =>
      Promise.resolve({ data: [camila, deborah] })
    );

    const data = await axiosHTTPClient.post("/users", [camila, deborah]);

    expect(data).toEqual([camila, deborah]);
  });

  test("put", async () => {
    mockedAxios.put.mockImplementation(() =>
      Promise.resolve({ data: undefined })
    );

    const data = await axiosHTTPClient.put("/users/1", { past: 1 });

    expect(data).toEqual(undefined);
  });

  test("delete", async () => {
    mockedAxios.delete.mockImplementation(() =>
      Promise.resolve({ data: undefined })
    );

    const data = await axiosHTTPClient.delete("/users/1");

    expect(data).toEqual(undefined);
  });
});
