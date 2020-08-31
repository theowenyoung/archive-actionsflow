import {
  getWorkflows,
  renameJobsBySuffix,
  getJobsDependences,
  buildNativeEvent,
  buildNativeSecrets,
  buildSingleWorkflow,
} from "../workflow";
import path from "path";
import { readJson, readFile } from "fs-extra";
import yaml from "js-yaml";

test("get workflows", async () => {
  const workflows = await getWorkflows({
    cwd: path.resolve(__dirname, "./fixtures"),
    context: {
      github: {
        event: {},
      },
      secrets: {},
    },
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect((workflows[0] as any).data.on.rss.url).toBe(
    "https://hnrss.org/newest?points=300"
  );
});

test("rename jobs by suffix", () => {
  const newJobs = renameJobsBySuffix(
    {
      job1: {},
      job2: {},
    },
    "_0"
  );
  expect(newJobs).toEqual({
    job1_0: {},
    job2_0: {},
  });
});

test("get jobs dependence", () => {
  const jobsDependences = getJobsDependences({
    job1: {
      needs: ["job2"],
    },
    job2: {},
    job3: {
      needs: ["job1"],
    },
    job4: {},
    job5: {
      needs: ["job4"],
    },
  });
  expect(jobsDependences).toEqual({
    lastJobs: ["job3", "job5"],
    firstJobs: ["job2", "job4"],
  });
});

test("build native event", async () => {
  await buildNativeEvent({
    dest: path.resolve(".cache"),
    github: {
      event: {
        action: "test",
      },
    },
  });
  const eventJson = await readJson(path.resolve(".cache/event.json"));
  expect(eventJson).toEqual({
    action: "test",
  });
});

test("build secrets", async () => {
  await buildNativeSecrets({
    dest: path.resolve(".cache"),
    secrets: {
      TOKEN: "token",
      TEST: "test",
    },
  });
  const secretsString = await readFile(path.resolve(".cache/.secrets"), "utf8");
  expect(secretsString).toEqual("TOKEN=token\nTEST=test\n");
});

test("build single workflow", async () => {
  const feedUrl = "https://hnrss.org/newest?points=300";
  const feedOptions = {
    url: feedUrl,
  };
  const feedPayload = {
    title: "Can't you just right click?",
    guid: "https://news.ycombinator.com/item?id=24217116",
  };
  await buildSingleWorkflow({
    dest: ".cache",
    context: {
      github: {
        event: {},
      },
      secrets: {},
    },
    workflow: {
      path: path.resolve(__dirname, "./fixtures/workflows/rss2.yml"),
      relativePath: "rss2.yml",
      data: {
        on: {
          rss: {
            url: feedUrl,
          },
        },
        jobs: {
          job1: {
            steps: [
              {
                run: "echo ${{ on.rss.outputs.title }}",
              },
            ],
          },
        },
      },
      rawTriggers: [
        {
          name: "rss",
          options: feedOptions,
        },
      ],
    },
    triggers: [
      {
        name: `rss`,
        options: feedOptions,
        payload: feedPayload,
      },
    ],
  });
  const workflowString = await readFile(
    path.resolve(".cache/workflows/rss2.yml"),
    "utf8"
  );
  const newWorkflow = yaml.safeLoad(workflowString);
  expect(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (newWorkflow as any).jobs.job1_0.steps[0].run
  ).toEqual(`echo Can't you just right click?`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect((newWorkflow as any).jobs.job1_0.name).toBe("job 0");
  // const newWorkflow = await readFile(path.resolve(".cache/workflows/"), "utf8");
});
