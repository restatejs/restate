import { Restate } from "@/Restate";

class CoreModel {
  constructor($resourceName: string, $restate: Restate) {
    if ($restate.has($resourceName)) {
      throw new Error(
        `RESTATE ERROR: there is already a Model that the resource name is '${$resourceName}'`
      );
    }

    $restate.set($resourceName, this);
  }
}

export { CoreModel };
