import { exec } from "child_process";

export function execPromise(command) {
  return new Promise((resolve) => {
    const ls = exec(command);

    ls.stdout.on("data", (data) => console.log(data));

    ls.on("close", (code) => resolve(code));
  });
}
