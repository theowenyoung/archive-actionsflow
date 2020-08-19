import { getCache } from "../cache";
import fs from "fs-extra";
const CACHE_KEY = `__test__`;
afterAll(() => {
  return fs.remove("./.cache");
});
test(`it returns a new cache instance`, () => {
  const cache = getCache(CACHE_KEY);

  expect(cache.get).toEqual(expect.any(Function));
  expect(cache.set).toEqual(expect.any(Function));
});

test(`it retrieves already created cache instance`, async () => {
  const key = `some-value`;
  const value = [`a`, `b`, `c`];
  const cache = getCache(CACHE_KEY);
  await cache.set(key, value);

  const other = getCache(CACHE_KEY);

  expect(await other.get(key)).toEqual(value);
});
