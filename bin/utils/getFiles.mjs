import { readdir, stat } from "fs/promises";
import path from "path";

export async function getFiles(dir) {
  const subdirs = await readdir(dir);

  const files = await Promise.all(
    subdirs.map(async (subdir) => {
      const res = path.resolve(dir, subdir);
      return (await stat(res)).isDirectory() ? getFiles(res) : res;
    })
  );

  return files.reduce((a, f) => a.concat(f), []);
}
