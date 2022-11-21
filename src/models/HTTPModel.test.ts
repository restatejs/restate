import type { AfterRequest } from "types/models/HTTPModel";

import axios from "axios";

import { HTTPModel } from "./HTTPModel";

jest.mock("axios");

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("models/HTTPModel", () => {
  const instanceAfterRequest: AfterRequest<any> = (item) => {
    item.instanceAfterRequest = true;
  };

  let httpModel: HTTPModel<unknown>;

  beforeAll(() => {
    const resourceName = "test";

    httpModel = new HTTPModel({
      resourceName,
      axios: mockedAxios,
      afterRequest: instanceAfterRequest,
    });
  });

  test("should be able to instantiate the HTTPModel class", async () => {
    expect(httpModel).toHaveProperty("$axios", mockedAxios);
    expect(httpModel).toHaveProperty("$afterRequest", instanceAfterRequest);
  });

  test("should be able to execute the request function", async () => {
    const axiosResponse = {};

    mockedAxios.request.mockImplementation(async () => ({
      data: axiosResponse,
    }));

    const methodAfterRequest: AfterRequest<any> = (item) => {
      item.methodAfterRequest = true;
    };

    const returnedData = {
      safe: true,
    };

    const { loaded, data } = httpModel.request(
      "/test",
      {
        method: "POST",
        query: {
          key: "value",
        },
        data: {
          key: "value",
        },
        afterRequest: methodAfterRequest,
      },
      returnedData
    );

    expect(data).toHaveProperty("safe", true);

    expect(axiosResponse).not.toHaveProperty("instanceAfterRequest");
    expect(axiosResponse).not.toHaveProperty("methodAfterRequest");

    await loaded;

    expect(axiosResponse).toHaveProperty("instanceAfterRequest", true);
    expect(axiosResponse).toHaveProperty("methodAfterRequest", true);
  });
});
