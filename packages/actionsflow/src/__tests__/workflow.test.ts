import {
  getWorkflows,
  renameJobsBySuffix,
  getJobsDependences,
  getBuiltWorkflow,
} from "../workflow";
import path from "path";

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

test("build single workflow", async () => {
  const feedUrl = "https://hnrss.org/newest?points=300";
  const feedOptions = {
    url: feedUrl,
  };
  const feedPayload = {
    title: "Can't you just right click?",
    guid: "https://news.ycombinator.com/item?id=24217116",
  };
  const workflowData = await getBuiltWorkflow({
    workflow: {
      path: path.resolve(__dirname, "./fixtures/workflows/rss2.yml"),
      relativePath: "rss2.yml",
      filename: "rss2",
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
    trigger: {
      name: "rss",
      results: [
        {
          outputs: feedPayload,
          outcome: "success",
          conclusion: "success",
        },
      ],
    },
  });
  expect(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (workflowData as any).jobs.job1_0.steps[0].run
  ).toEqual(
    "echo ${{ (fromJSON(env.ACTIONSFLOW_TRIGGER_RESULT_FOR_rss_0)).outputs.title }}"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect((workflowData as any).jobs.job1_0.name).toBe("job 0");
  // const newWorkflow = await readFile(path.resolve(".cache/workflows/"), "utf8");
});
