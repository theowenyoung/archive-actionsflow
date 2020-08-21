// eslint-disable-next-line @typescript-eslint/no-var-requires
const glob = require(`glob`);

const pkgs = glob
  .sync(`./packages/*/src`)
  .map((p) => p.replace(/^\./, `<rootDir>`));
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: pkgs,
  testPathIgnorePatterns: [`__tests__/fixtures`, ".util.ts"],
  verbose: true,
};
