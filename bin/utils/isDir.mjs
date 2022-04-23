import { lstatSync } from "fs";

export function isDir(path) {
  try {
    const stat = lstatSync(path);
    return stat.isDirectory();
  } catch (e) {
    return false;
  }
}
