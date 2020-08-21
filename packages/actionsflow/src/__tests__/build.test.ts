import build from "../build";
import { remove, readFile } from "fs-extra";
import path from "path";
import yaml from "js-yaml";
beforeAll(async () => {
  await remove("./.cache");
});

afterEach(async () => {
  await remove("./.cache");
});

test("build workflows", async () => {
  // set process env
  process.env.JSON_SECRETS =
    '{"GITHUB_TOKEN": "fake_github_token","IFTTT_KEY":"fake_ifttt_key","TELEGRAM_BOT_TOKEN":"fake_telegram_bot_token"}';

  await build({
    base: path.resolve(__dirname, "./fixtures"),
  });
  // read built file
  const yamlString = await readFile(
    path.resolve(__dirname, "./fixtures/dist/workflows/rss.yaml"),
    "utf8"
  );
  const newWorkflow = yaml.safeLoad(yamlString);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect((newWorkflow as any).jobs.ifttt_0.steps[0].with.key).toBe(
    "fake_ifttt_key"
  );
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  expect((newWorkflow as any).jobs.ifttt_1.needs[0]).toBe("ifttt_0");
});
