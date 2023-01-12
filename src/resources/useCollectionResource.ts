import type { PickNumberOrStringKeys, ResourceEntity } from "types/resources";
import type { State } from "types/resources/CollectionResource";
import type { UseCollectionResourceOptions } from "types/resources/useCollectionResource";

import { ref } from "vue";

import { CollectionResource } from "./CollectionResource";
import { Indexes } from "./Indexes";

function useCollectionResource<
  RI extends ResourceEntity,
  Raw extends ResourceEntity = RI,
  PK extends PickNumberOrStringKeys<Raw> = PickNumberOrStringKeys<Raw>
>({
  primaryKey,
  computedProperties = {},
}: UseCollectionResourceOptions<RI, PK>): CollectionResource<RI, Raw, PK> {
  const indexes = new Indexes() as any;

  const state: State<RI> = ref([]);

  const collectionResource = new CollectionResource<RI, Raw, PK>({
    primaryKey,
    indexes,
    state,
    computedProperties,
  });

  return collectionResource;
}

export { useCollectionResource };
