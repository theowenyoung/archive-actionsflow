import path from "path";
import { readJson, readFile } from "fs-extra";
import {
  buildNativeEvent,
  buildNativeSecrets,
  buildWorkflowFile,
} from "../generate";

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

test("build workflow file", async () => {
  await buildWorkflowFile({
    dest: path.resolve(".cache", "workflow.yml"),
    workflowData: {
      on: ["push"],
    },
  });
  const workflowContent = await readFile(
    path.resolve(".cache/workflow.yml"),
    "utf8"
  );
  expect(workflowContent).toEqual(`'on':
  - push
`);
});
