import path from "path";
import yaml from "js-yaml";
import fs from "fs-extra";
import { log } from "./log";
import { AnyObject } from "actionsflow-interface";
export const buildNativeEvent = async (options: {
  dest: string;
  github: AnyObject;
}): Promise<{ path: string; eventJson: string }> => {
  const baseDest = options.dest;
  const github = options.github;
  const destWorkflowEventPath = path.resolve(baseDest, "event.json");
  let eventJson = "{}";
  if (!github.event) {
    github.event = {};
  }
  eventJson = JSON.stringify(github.event, null, 2);
  await fs.outputFile(destWorkflowEventPath, eventJson);
  log.debug("build event file success", destWorkflowEventPath);

  return {
    path: destWorkflowEventPath,
    eventJson: eventJson,
  };
};
export const buildNativeSecrets = async (options: {
  dest: string;
  secrets: AnyObject;
}): Promise<{ path: string; secrets: string }> => {
  const baseDest = options.dest;
  const secretsObj = options.secrets;

  const destWorkflowSecretsPath = path.resolve(baseDest, ".secrets");
  let secrets = "";
  Object.keys(secretsObj).forEach((key) => {
    secrets += key + "=" + secretsObj[key] + "\n";
  });
  await fs.outputFile(destWorkflowSecretsPath, secrets);
  log.debug("build secrets file success", destWorkflowSecretsPath);
  return {
    path: destWorkflowSecretsPath,
    secrets: secrets,
  };
};

export const buildWorkflowFile = async ({
  workflowData,
  dest,
}: {
  workflowData: AnyObject;
  dest: string;
}): Promise<{ path: string; workflowContent: string }> => {
  const workflowContent = yaml.safeDump(workflowData);
  log.debug("generate workflow file: ", dest);
  await fs.outputFile(dest, workflowContent);
  return {
    path: dest,
    workflowContent: workflowContent,
  };
};
