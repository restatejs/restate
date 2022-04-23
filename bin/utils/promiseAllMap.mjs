export function promiseAllMap(arr, callback) {
  const promises = arr.map(callback);

  return Promise.all(promises);
}
