import type { ComputedProperties, ResourceEntity } from ".";
import type { ItemResource } from "./ItemResource";

export interface UseItemResourceOptions<RI extends ResourceEntity> {
  computedProperties?: ComputedProperties<RI>;
}

export declare function useItemResource<
  RI extends ResourceEntity,
  Raw extends ResourceEntity = RI
>(options?: UseItemResourceOptions<RI>): ItemResource<RI, Raw>;
