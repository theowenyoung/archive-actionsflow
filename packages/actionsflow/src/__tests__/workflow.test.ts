import {
  getWorkflows,
  renameJobsBySuffix,
  getJobsDependences,
} from "../workflow";
import path from "path";
import workflowJson from "./fixtures/results/get-workflows.json";
test("get workflows", async () => {
  const workflows = await getWorkflows({
    src: path.resolve(__dirname, "./fixtures/workflows"),
    context: {
      github: {
        event: {},
      },
      secrets: {},
    },
  });
  expect(JSON.stringify(workflows)).toBe(JSON.stringify(workflowJson));
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
