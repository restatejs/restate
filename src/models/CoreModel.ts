import type { Ref } from "vue";
import { ref } from "vue";

import { Resource } from "..";

class CoreModel<RI> {
  public $resource: Resource<RI>;

  constructor(public $resourceName: string) {
    this.$resource = new Resource<RI>();
  }

  public load(request: () => Promise<void>): {
    loaded: Promise<boolean>;
    loading: Ref<boolean>;
  } {
    const loading = ref(true);

    const loaded = (async () => {
      await request();

      loading.value = false;

      return true;
    })();

    return {
      loaded,
      loading,
    };
  }
}

export { CoreModel };
