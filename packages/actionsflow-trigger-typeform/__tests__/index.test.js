const path = require("path");
const typeform = require("../index");
const {
  getTriggerHelpers,
  getContext,
  getWorkflow,
  formatRequest,
} = require("actionsflow-core");

test("typeform with webhook", async () => {
  const typeformBot = new typeform({
    options: {},
    helpers: getTriggerHelpers({
      name: "typeform",
      workflowRelativePath: "workflow.yml",
    }),
    workflow: await getWorkflow({
      path: path.resolve(__dirname, "fixtures/workflows/workflow.yml"),
      cwd: path.resolve(__dirname, "fixtures"),
      context: getContext(),
    }),
  });

  const requestPayload = formatRequest({
    path: "/",
    body: {
      event_id: "01EK4R5PFZZP6C8H14RTP4YW6C",
      event_type: "form_response",
      form_response: {
        form_id: "g8hcyeXS",
        token: "x71for1wr6irs2rx71fotn12b3izh25v",
        landed_at: "2020-09-26T08:23:47Z",
        submitted_at: "2020-09-26T08:23:49Z",
        definition: {
          id: "g8hcyeXS",
          title: "Feedback",
          fields: [
            {
              id: "M8JLOd0nIQPU",
              title: "What's your name?",
              type: "short_text",
              ref: "9a489f17-8765-494b-933e-3624c645bd0c",
              properties: {},
            },
          ],
        },
        answers: [
          {
            type: "text",
            text: "test1",
            field: {
              id: "M8JLOd0nIQPU",
              type: "short_text",
              ref: "9a489f17-8765-494b-933e-3624c645bd0c",
            },
          },
        ],
      },
    },
    method: "POST",
    headers: {},
  });
  const request = {
    ...requestPayload,
    params: {},
  };
  const triggerResults = typeformBot.webhooks[0].handler.bind(typeformBot)(
    request
  );
  console.log(JSON.stringify(triggerResults[0], null, 2));
  expect(triggerResults.length).toBe(1);
  expect(triggerResults[0].answers_map["What's your name?"]).toBe("test1");
});
