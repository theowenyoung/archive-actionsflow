import Script from "../script";
import { getTriggerConstructorParams } from "./trigger.util";
import path from "path";
test("script trigger", async () => {
  const script = new Script(
    await getTriggerConstructorParams({
      options: {
        run: `return {
          items: [{id:'test',title:'test'}]
        }`,
      },
      name: "script",
    })
  );
  const triggerResults = await script.run();
  expect(triggerResults.items.length).toBe(1);
  const itemKey = script.getItemKey(triggerResults.items[0]);
  expect(itemKey).toBe("test");
});

test("script trigger with options", async () => {
  const script = new Script(
    await getTriggerConstructorParams({
      options: {
        test: "222",
        run: `return {
          items: [{id:'test',title:'test',options:options}]
        }`,
      },
      name: "script",
    })
  );
  const triggerResults = await script.run();
  expect(triggerResults.items.length).toBe(1);
  const options = triggerResults.items[0].options as Record<string, string>;
  expect(options.test).toBe("222");
});

test("script trigger with deduplication_key", async () => {
  const script = new Script(
    await getTriggerConstructorParams({
      options: {
        run: `return {
          items: [{id:'test',title:'test'}]
        }`,
        deduplication_key: "title",
      },
      name: "script",
    })
  );
  const triggerResults = await script.run();

  expect(triggerResults.items.length).toBe(1);
  const itemKey = script.getItemKey(triggerResults.items[0]);
  expect(itemKey).toBe("test");
});

test("script trigger with deduplication_key no found", async () => {
  const script = new Script(
    await getTriggerConstructorParams({
      options: {
        run: `return {
          items: [{id2:'test',title:'test'}]
        }`,
      },
      name: "script",
    })
  );
  const triggerResults = await script.run();

  expect(triggerResults.items.length).toBe(1);
  const itemKey = script.getItemKey(triggerResults.items[0]);
  expect(itemKey).toBe("0ace22c97c74a9a75c1aabc6eb40fcdf");
});

test("script trigger without required param", async () => {
  const script = new Script(
    await getTriggerConstructorParams({
      options: {},
      name: "script",
    })
  );

  await expect(script.run()).rejects.toEqual(
    new Error(
      "Miss param run or path, you must provide one of run or path at least"
    )
  );
});

test("script trigger with file path", async () => {
  const script = new Script(
    await getTriggerConstructorParams({
      options: {
        path: path.resolve(__dirname, "fixtures/script.js"),
      },
      name: "script",
    })
  );
  const triggerResults = await script.run();
  expect(triggerResults.items.length).toBe(2);
  const itemKey = script.getItemKey(triggerResults.items[0]);
  expect(itemKey).toBe("test1");
});

test("script trigger with github token", async () => {
  const token = process.env.GITHUB_TOKEN || "";
  if (!token) {
    // skip github test
    return;
  }
  const script = new Script(
    await getTriggerConstructorParams({
      options: {
        github_token: token,
        run: `
        let items = [];
        const results = await github.issues.listForRepo({
          owner:"actionsflow",
          repo:"actionsflow",
        });
        return {
          items:resutls.data
        }
        `,
      },
      name: "script",
    })
  );
  const triggerResults = await script.run();
  expect(Array.isArray(triggerResults.items)).toBe(true);
});
