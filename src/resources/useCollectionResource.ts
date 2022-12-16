import type {
  ComputedPropertiesMap,
  PickNumberOrStringKeys,
  ResourceEntity,
} from "types/resources";
import type { ComputedState, State } from "types/resources/CollectionResource";
import type { UseCollectionResourceOptions } from "types/resources/useCollectionResource";

import { computed, ref } from "vue";

import { CollectionResource } from "./CollectionResource";
import { Indexes } from "./Indexes";

function $getComputedState<
  S extends State<any> = State<any>,
  C extends ComputedPropertiesMap<any> = ComputedPropertiesMap<any>,
  RI extends ResourceEntity = C extends ComputedPropertiesMap<infer R>
    ? R
    : never
>(state: S, computedProperties: C): ComputedState<RI> {
  const computedState = computed(() => {
    const mappedState = state.value.map((item) => {
      const clonedItem = { data: { ...item.data } } as unknown as {
        data: RI;
      };

      if (clonedItem.data !== undefined) {
        computedProperties.forEach((callback, prop) => {
          if (prop in clonedItem.data) {
            throw new Error(`The ${String(prop)} property is already defined.`);
          }

          clonedItem.data[prop as keyof RI] = callback(clonedItem.data) as any;
        });
      }

      return clonedItem;
    });

    return mappedState;
  });

  return computedState;
}

function useCollectionResource<
  RI extends ResourceEntity,
  Raw extends ResourceEntity = RI,
  PK extends PickNumberOrStringKeys<Raw> = PickNumberOrStringKeys<Raw>
>({
  primaryKey,
  computedProperties = {},
}: UseCollectionResourceOptions<RI, PK>): CollectionResource<RI, Raw, PK> {
  const indexes = new Indexes() as any;

  const state: State<Raw> = ref([]);

  const computedPropertiesMap: ComputedPropertiesMap<RI> = new Map(
    Object.entries(computedProperties)
  );

  const computedState = $getComputedState(state, computedPropertiesMap);

  const collectionResource = new CollectionResource({
    primaryKey,
    indexes,
    state,
    computedState,
  });

  return collectionResource;
}

export { useCollectionResource };
