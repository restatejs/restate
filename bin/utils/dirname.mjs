import path from "path";
import { fileURLToPath } from "url";

export function dirname(url) {
  return path.dirname(fileURLToPath(url));
}
