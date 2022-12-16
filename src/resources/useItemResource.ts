import type { ComputedPropertiesMap, ResourceEntity } from "types/resources";
import type { ComputedState, State } from "types/resources/ItemResource";
import type { UseItemResourceOptions } from "types/resources/useItemResource";

import { computed, ref } from "vue";

import { ItemResource } from "./ItemResource";

function $getComputedState<
  S extends State<any> = State<any>,
  C extends ComputedPropertiesMap<any> = ComputedPropertiesMap<any>,
  RI extends ResourceEntity = C extends ComputedPropertiesMap<infer R>
    ? R
    : never
>(state: S, computedProperties: C): ComputedState<RI> {
  const computedState = computed(() => {
    if (!state.value) return undefined;

    const clonedItem = { ...state.value };

    computedProperties.forEach((callback, prop) => {
      if (prop in clonedItem) {
        throw new Error(`The ${String(prop)} property is already defined.`);
      }

      clonedItem[prop as keyof RI] = callback(clonedItem) as any;
    });

    return clonedItem;
  });

  return computedState;
}

function useItemResource<
  RI extends ResourceEntity,
  Raw extends ResourceEntity = RI
>(options?: UseItemResourceOptions<RI>): ItemResource<RI, Raw> {
  const state: State<Raw> = ref(undefined);

  const computedPropertiesMap: ComputedPropertiesMap<RI> = new Map(
    Object.entries(options?.computedProperties || [])
  );

  const computedState = $getComputedState(state, computedPropertiesMap);

  const collectionResource = new ItemResource({
    state,
    computedState,
  });

  return collectionResource;
}

export { useItemResource };
