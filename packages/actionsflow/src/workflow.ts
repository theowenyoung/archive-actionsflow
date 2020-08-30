import path from "path";
import fg from "fast-glob";
import yaml from "js-yaml";
import mapObj from "map-obj";
import { createContentDigest, getCache } from "./helpers";
import fs from "fs-extra";
import log from "./log";
import { template, getThirdPartyTrigger } from "./util";
import * as Triggers from "./triggers";
import multimatch from "multimatch";
import {
  ITriggerContext,
  ITrigger,
  IWorkflow,
  AnyObject,
  ITriggerClassTypeConstructable,
} from "actionsflow-interface";

const getSupportedTriggers = (
  doc: AnyObject,
  context: ITriggerContext
): ITrigger[] => {
  const supportTriggerKeys = Object.keys(Triggers);
  const AllTriggers = Triggers as Record<
    string,
    ITriggerClassTypeConstructable
  >;
  const supportTriggerIds = supportTriggerKeys.map((triggerKey) => {
    const Trigger = AllTriggers[triggerKey];
    const triggerInstance = new Trigger({
      options: {},
      context: context,
      helpers: { createContentDigest, cache: getCache(`trigger-temp`) },
    });
    return triggerInstance.name;
  });
  const triggers = [];
  if (doc && doc.on) {
    const onObj = doc.on as Record<string, Record<string, unknown>>;
    const keys = Object.keys(onObj);
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index] as string;
      // check thirdparty support
      let isTriggerSupported = false;
      if (supportTriggerIds.includes(key)) {
        isTriggerSupported = true;
      } else if (getThirdPartyTrigger(key)) {
        isTriggerSupported = true;
      }
      if (isTriggerSupported) {
        // is active
        if (!(onObj[key] && onObj[key].active === false)) {
          // handle context expresstion
          let newOptions = onObj[key];
          if (onObj[key]) {
            const on: Record<string, unknown> = onObj[key];
            newOptions = mapObj(
              on,
              (mapKey, mapValue) => {
                if (typeof mapValue === "string") {
                  // if supported
                  mapValue = template(mapValue, context, {
                    shouldReplaceUndefinedToEmpty: true,
                  });
                }
                return [mapKey, mapValue];
              },
              {
                deep: true,
              }
            );
          }

          // valid event
          triggers.push({
            name: key,
            options: newOptions || {},
          });
        }
      }
    }
  }
  return triggers;
};
interface IGetWorkflowsOptions {
  context: ITriggerContext;
  cwd: string;
  include?: string[];
  exclude?: string[];
}
export const getWorkflows = async (
  options: IGetWorkflowsOptions
): Promise<IWorkflow[]> => {
  const { context, cwd } = options;
  const include = options.include as string[];
  const exclude = options.exclude as string[];
  const workflowsPath = path.resolve(cwd, "workflows");
  // check is folder
  const stat = await fs.lstat(workflowsPath);
  const isFile = stat.isFile();
  let entries = [];
  if (isFile) {
    // check is exist
    const isExist = await fs.pathExists(workflowsPath);
    if (isExist) {
      // relative path
      const relativePath = path.relative(
        path.resolve(cwd, "workflows"),
        workflowsPath
      );
      entries.push({
        path: workflowsPath,
        relativePath,
      });
    }
  } else {
    // get all files with json object
    let relativeEntries = await fg(["**/*.yml", "**/*.yaml"], {
      cwd: workflowsPath,
      dot: true,
    });
    const patterns: string[] = arrify(include).concat(negate(exclude));

    // filter
    if (patterns.length) {
      log.debug("workflows filter", patterns);

      if (!include.length) {
        // only excludes needs to select all items first
        // globstar is for matching scoped packages
        patterns.unshift("**");
      }
      relativeEntries = multimatch(relativeEntries, patterns);
    }
    entries = relativeEntries.map((relativePath) => {
      return {
        relativePath,
        path: path.resolve(workflowsPath, relativePath),
      };
    });
  }

  const workflows: IWorkflow[] = [];
  // Get document, or throw exception on error
  for (let index = 0; index < entries.length; index++) {
    const filePath = entries[index].path;
    try {
      const doc = yaml.safeLoad(await fs.readFile(filePath, "utf8"));
      if (doc) {
        const triggers = getSupportedTriggers(doc as AnyObject, context);
        workflows.push({
          path: filePath,
          relativePath: entries[index].relativePath,
          data: doc as AnyObject,
          rawTriggers: triggers,
        });
      } else {
        log.debug("skip empty file", filePath);
      }
    } catch (e) {
      log.error("load yaml file error:", filePath, e);
    }
  }

  return workflows;
};

export const getJobsDependences = (
  jobs: Record<string, AnyObject>
): { lastJobs: string[]; firstJobs: string[] } => {
  const jobKeys = Object.keys(jobs);
  const jobsWhoHasNeeds: {
    id: string;
    needs: string[];
  }[] = [];
  const jobsNoNeeds: string[] = [];
  jobKeys.forEach((jobKey) => {
    const job = jobs[jobKey] as { needs: string[] };
    if (job && job.needs && job.needs.length > 0) {
      jobsWhoHasNeeds.push({
        id: jobKey,
        needs: job.needs,
      });
    }
    if (!job.needs || job.needs.length === 0) {
      jobsNoNeeds.push(jobKey);
    }
  });

  let lastJobs: string[] = [];
  let beNeededJobs: string[] = [];
  jobsWhoHasNeeds.forEach((job) => {
    job.needs.forEach((beNeededJob) => {
      const isBeNeeded = jobsWhoHasNeeds.find(
        (item) => item.id === beNeededJob
      );
      if (isBeNeeded) {
        beNeededJobs.push(beNeededJob);
      }
    });
  });
  beNeededJobs = [...new Set(beNeededJobs)];
  jobsWhoHasNeeds.forEach((job) => {
    if (!beNeededJobs.includes(job.id)) {
      lastJobs.push(job.id);
    }
  });
  if (lastJobs.length === 0) {
    lastJobs = jobKeys;
  }
  return { lastJobs, firstJobs: jobsNoNeeds };
};

export const renameJobsBySuffix = (
  jobs: Record<string, AnyObject>,
  suffix: string
): Record<string, AnyObject> => {
  const jobKeys = Object.keys(jobs);
  const newJobs: Record<string, AnyObject> = {};
  jobKeys.forEach((jobKey) => {
    const job = jobs[jobKey] as {
      needs: string[];
    };
    const newJobKey = `${jobKey}${suffix}`;
    if (job.needs) {
      job.needs = job.needs.map((item: string) => {
        return `${item}${suffix}`;
      });
    }
    newJobs[newJobKey] = job;
  });
  return newJobs;
};
interface IBuildSingleWorkflowOptions {
  context: ITriggerContext;
  workflow: IWorkflow;
  dest: string;
  triggers: ITrigger[];
}
export const buildSingleWorkflow = async (
  options: IBuildSingleWorkflowOptions
): Promise<{ workflow: AnyObject }> => {
  log.debug("buildWorkflow options:", options);
  const { context: workflowContext, workflow, dest, triggers } = options;
  const relativePathWithoutExt = workflow.relativePath
    .split(".")
    .slice(0, -1)
    .join(".");
  const destWorkflowPath = path.resolve(
    dest,
    "workflows",
    `${relativePathWithoutExt}.yml`
  );
  const workflowData = workflow.data;
  // handle context expresstion
  const workflowDataJobs: Record<
    string,
    AnyObject
  > = workflowData.jobs as Record<string, AnyObject>;
  delete workflowData.jobs;
  const newWorkflowData = workflowData;
  const jobsGroups: {
    lastJobs: string[];
    firstJobs: string[];
    jobs: Record<string, AnyObject>;
  }[] = [];
  for (let index = 0; index < triggers.length; index++) {
    const trigger = triggers[index];
    const { payload, name, options: triggerOptions } = trigger;
    const context = {
      ...workflowContext,
      on: {
        [name]: {
          outputs: payload,
          options: triggerOptions,
        },
      },
    };
    // handle context expresstion
    const newJobs = mapObj(
      workflowDataJobs as Record<string, unknown>,
      (key, value) => {
        value = value as unknown;
        if (typeof value === "string") {
          // if supported

          value = template(value, context, {
            shouldReplaceUndefinedToEmpty: true,
          });
        }
        return [key, value];
      },
      {
        deep: true,
      }
    );

    const jobs = renameJobsBySuffix(
      newJobs as Record<string, AnyObject>,
      `_${index}`
    );

    // jobs id rename for merge

    const jobsDependences = getJobsDependences(jobs);
    jobsGroups.push({
      lastJobs: jobsDependences.lastJobs,
      firstJobs: jobsDependences.firstJobs,
      jobs: jobs,
    });
  }

  const finalJobs: Record<string, AnyObject> = {};

  jobsGroups.forEach((jobsGroup, index) => {
    const jobs = jobsGroup.jobs;
    const jobKeys = Object.keys(jobs);

    if (index > 0) {
      jobKeys.forEach((jobKey) => {
        const job = jobs[jobKey];
        if (jobsGroup.firstJobs.includes(jobKey)) {
          if (Array.isArray(job.needs)) {
            job.needs = job.needs.concat(jobsGroups[index - 1].lastJobs);
          } else {
            job.needs = jobsGroups[index - 1].lastJobs;
          }
          finalJobs[jobKey] = job;
        } else {
          finalJobs[jobKey] = job;
        }
      });
    } else {
      jobKeys.forEach((jobKey) => {
        const job = jobs[jobKey];
        finalJobs[jobKey] = job;
      });
    }
  });
  // finalJobs name unique for act unique name
  const finalJobKeys = Object.keys(finalJobs);
  finalJobKeys.forEach((jobKey, index) => {
    const job = finalJobs[jobKey];
    if (job.name) {
      job.name = `${job.name} ${index}`;
    } else {
      job.name = `job ${index}`;
    }
    finalJobs[jobKey] = job;
  });
  newWorkflowData.on = {
    push: null,
  };
  newWorkflowData.jobs = finalJobs;

  const workflowContent = yaml.safeDump(newWorkflowData);
  log.debug("generate workflow file: ", destWorkflowPath);
  await fs.outputFile(destWorkflowPath, workflowContent);
  return {
    workflow: newWorkflowData,
  };
};

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

function arrify(thing: string | string[]): string[] {
  if (!thing) {
    return [];
  }

  if (!Array.isArray(thing)) {
    return [thing];
  }

  return thing;
}

function negate(patterns: string | string[]): string[] {
  return arrify(patterns).map((pattern) => `!${pattern}`);
}
