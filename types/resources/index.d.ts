import type { PickProperties } from "ts-essentials";

export type ResourceEntity = Record<string, any>;

export type PickNumberOrStringKeys<O extends ResourceEntity> = string &
  keyof PickProperties<O, number | string>;

export type ComputedProperty<RI extends ResourceEntity, Return = unknown> = (
  item: RI
) => Return;

export type ComputedProperties<RI extends ResourceEntity> = {
  [Prop in keyof RI]?: ComputedProperty<RI, RI[Prop]>;
};

export type ComputedPropertiesMap<RI extends ResourceEntity> = Map<
  string & keyof RI,
  ComputedProperty<RI>
>;
