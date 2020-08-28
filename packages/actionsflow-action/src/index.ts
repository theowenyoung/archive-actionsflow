import * as core from "@actions/core";
import { build } from "actionsflow";

build({
  logLevel: "debug",
})
  .then(() => {
    core.setOutput("success", true);
  })
  .catch((e) => {
    core.setOutput("success", false);
    core.setFailed(e);
  });
