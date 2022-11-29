import type { PickProperties } from "ts-essentials";

export type ResourceEntity = Record<string, any>;

export type PickNumberOrStringKeys<O extends ResourceEntity> =
  keyof PickProperties<O, number | string>;
