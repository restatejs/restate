import type {
  ComputedProperties,
  PickNumberOrStringKeys,
  ResourceEntity,
} from ".";
import type { CollectionResource } from "./CollectionResource";

export interface UseCollectionResourceOptions<RI, PK> {
  primaryKey: PK;
  computedProperties?: ComputedProperties<RI>;
}

export declare function useCollectionResource<
  RI extends ResourceEntity,
  Raw extends ResourceEntity = RI,
  PK extends PickNumberOrStringKeys<Raw> = PickNumberOrStringKeys<Raw>
>(
  options: UseCollectionResourceOptions<RI, PK>
): CollectionResource<RI, Raw, PK>;
