import type { IndexesMap, SetAllOptions } from "types/resources/Indexes";

import type { Ref } from "vue";
import { ref } from "vue";

class Indexes<Key extends number | string = number | string> {
  protected $storage: Ref<IndexesMap<Key>>;

  constructor() {
    this.$storage = ref({}) as Ref<IndexesMap<Key>>;
  }

  public get(key: Key): number | undefined {
    return this.$storage.value[key];
  }

  public set(key: Key, index: number): void {
    this.$storage.value[key] = index;
  }

  public setAll(indexes: [Key, number][], options?: SetAllOptions): void {
    if (options?.clear === false) {
      indexes.forEach(([key, index]) => this.set(key, index));
    } else {
      this.$storage.value = Object.fromEntries(indexes) as IndexesMap<Key>;
    }
  }

  public has(key: Key): boolean {
    return key in this.$storage.value;
  }

  public delete(key: Key): void {
    if (this.$storage.value[key] === undefined) {
      throw new Error("Index not removed.");
    }

    delete this.$storage.value[key];
  }

  public clear(): void {
    this.$storage.value = {} as any;
  }
}

export { Indexes };
