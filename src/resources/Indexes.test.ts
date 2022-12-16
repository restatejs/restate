import { Indexes } from "./Indexes";

describe("Indexes", () => {
  let indexes: Indexes;
  let storage: Indexes["$storage"];

  beforeAll(() => {
    indexes = new Indexes();
    storage = Reflect.get(indexes, "$storage");
  });

  beforeEach(() => {
    indexes.clear();
  });

  test("should be able to execute the set function", () => {
    expect(storage.value).toEqual({});

    indexes.set(64, 7);

    expect(storage.value).toEqual({ 64: 7 });
  });

  test("should be able to execute the setAll function", () => {
    expect(storage.value).toEqual({});

    indexes.setAll([
      [64, 7],
      [65, 8],
    ]);

    expect(storage.value).toEqual({ 64: 7, 65: 8 });
  });

  test("should be able to execute the get function", () => {
    indexes.set(64, 7);

    expect(indexes.get(64)).toEqual(7);
  });

  test("should be able to execute the has function", () => {
    indexes.set(64, 7);

    expect(indexes.has(64)).toEqual(true);
    expect(indexes.has(65)).toEqual(false);
  });

  test("should be able to execute the delete function", () => {
    expect(() => indexes.delete(64)).toThrow();

    indexes.set(64, 7);
    indexes.delete(64);

    expect(indexes.get(64)).toBe(undefined);
  });

  test("should be able to execute the clear function", () => {
    indexes.set(64, 7);
    indexes.set(65, 8);

    indexes.clear();

    expect(indexes.get(64)).toBe(undefined);
    expect(indexes.get(65)).toBe(undefined);
  });
});
