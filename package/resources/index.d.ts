import type { PickProperties } from "ts-essentials";

export type ResourceEntity = Record<string, any>;

export type PickNumberOrStringKeys<O extends ResourceEntity> = string &
  keyof PickProperties<O, number | string>;

export type ComputedProperty<Raw extends ResourceEntity, Return = unknown> = (
  item: Raw
) => Return;

export type ComputedProperties<Raw extends ResourceEntity> = {
  [Prop in keyof Raw]?: ComputedProperty<Raw, Raw[Prop]>;
};

export type ComputedPropertiesMap<Raw extends ResourceEntity> = Map<
  string & keyof Raw,
  ComputedProperty<Raw>
>;
