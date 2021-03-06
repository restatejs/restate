import { cp, rm } from "fs/promises";
import path from "path";

import {
  dirname,
  isDir,
  execPromise,
  promiseAllMap,
  getFiles,
} from "./utils/index.mjs";

const rootPath = path.resolve(dirname(import.meta.url), "..");
const distPath = `${rootPath}/dist`;
const packagePath = `${rootPath}/package`;
const typesPath = `${rootPath}/types`;

// CLEAN
const dirsClean = [distPath, packagePath];

await promiseAllMap(dirsClean, async (path) => {
  if (isDir(path)) {
    await rm(path, { recursive: true });
    console.log(`REMOVE DIRECTORY ${path}`);
  }
});

// WEBPACK
await execPromise("yarn webpack");

// COPIES
await cp(distPath, packagePath, { recursive: true });

const copies = {
  [`${rootPath}/package.json`]: `${packagePath}/package.json`,
  [`${rootPath}/LICENSE`]: `${packagePath}/LICENSE`,
};

const typesFiles = await getFiles(typesPath);

typesFiles.forEach((file) => {
  copies[file] = file.replace("\\types\\", "\\package\\");
});

await promiseAllMap(Object.entries(copies), async ([source, destination]) => {
  await cp(source, destination, { recursive: true });
  console.log(`COPY ${path.normalize(source.replace(rootPath, ""))}`);
});

// REMOVE DIST
await rm(distPath, { recursive: true });

// NPM
await execPromise("cd package && npm pkg delete scripts private");
