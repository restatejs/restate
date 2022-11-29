import type { ResourceEntity } from "types/resources";
import type { ResourceItemState } from "types/resources/ItemResource";

import type { Ref } from "vue";
import { ref } from "vue";

class ItemResource<RI extends ResourceEntity> {
  public state: ResourceItemState<RI>;

  constructor() {
    this.state = ref(undefined);
  }

  public get(): ResourceItemState<RI> {
    return this.state;
  }

  public set(data: RI): Ref<RI> {
    this.state.value = data;

    return this.state as Ref<RI>;
  }

  public setProperty<P extends string & keyof RI>(
    prop: P,
    value: RI[P]
  ): Ref<RI> {
    const item = this.state.value;

    if (!item) {
      throw new Error("Property not updated.");
    }

    item[prop] = value;

    return this.state as Ref<RI>;
  }

  public has(): boolean {
    return !!this.state.value;
  }

  public clear(): void {
    this.state.value = undefined;
  }
}

export { ItemResource };
