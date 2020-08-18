import core from "@actions/core";
import { build } from "actionsflow";

build({
  logLevel: "debug",
})
  .then(() => {
    core.setOutput("result", "test");
  })
  .catch((e) => {
    core.setFailed(e);
  });
