import { ITriggerContext, IGithub } from "actionsflow-interface";
import log from "./log";
export const getContext = (): ITriggerContext => {
  let secretObj: Record<string, string> = {};
  try {
    if (process.env.JSON_SECRETS) {
      secretObj = JSON.parse(process.env.JSON_SECRETS);
    }
    if (!secretObj) {
      secretObj = {};
    }
  } catch (error) {
    log.warn("parse enviroment variable JSON_SECRETS error:", error);
  }
  let githubObj: IGithub = {
    event: {},
  };
  try {
    if (process.env.JSON_GITHUB) {
      githubObj = JSON.parse(process.env.JSON_GITHUB);
    }
    if (!githubObj) {
      githubObj = { event: {} };
    }
  } catch (error) {
    log.warn("parse enviroment variable JSON_GITHUB error:", error);
  }
  const context: ITriggerContext = {
    secrets: secretObj,
    github: githubObj,
  };
  return context;
};
