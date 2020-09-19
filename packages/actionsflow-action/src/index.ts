import * as core from "@actions/core";
import { build } from "actionsflow";
process.on("unhandledRejection", handleError);
main().catch(handleError);

async function main(): Promise<void> {
  const cwd = core.getInput("cwd");
  const dest = core.getInput("dest");
  const logLevel = core.getInput("log-level");
  const forceString = core.getInput("force");
  let force = false;
  if (forceString && forceString === "true") {
    force = true;
  }
  build({
    cwd,
    dest,
    logLevel,
    force,
  })
    .then(() => {
      core.setOutput("success", true);
    })
    .catch((e) => {
      core.setOutput("success", false);
      core.setFailed(e);
    });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function handleError(err: any): void {
  console.error(err);
  core.setFailed(`Unhandled error: ${err}`);
}
