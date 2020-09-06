import "./env";
import del from "del";
import { log } from "actionsflow-core";
import * as Log from "loglevel";
export default (options: {
  dest?: string;
  base?: string;
  logLevel?: Log.LogLevelDesc;
}): Promise<string[] | void> => {
  options = {
    dest: "./dist",
    base: process.cwd(),
    logLevel: "info",
    ...options,
  };
  return del([options.dest as string, "./.cache"]).then(() => {
    log.info("Successfully deleted directories");
  });
};
