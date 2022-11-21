import type { Ref } from "vue";

export type Load<D = undefined> = D extends null | undefined
  ? {
      loaded: Promise<boolean>;
      loading: Ref<boolean>;
    }
  : {
      loaded: Promise<boolean>;
      loading: Ref<boolean>;
      data: D;
    };

export declare function load<D>(callback: () => Promise<void>): Load<D>;
