import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { MemberAdditionFunctionDefinition } from "../functions/member_addition_function.ts";

const MemberAdditionWorkflow = DefineWorkflow({
  callback_id: "member_addition_workflow",
  title: "メンバー追加",
  description: "シャッフルランチのグループ作成メンバーを追加します",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["interactivity", "channel"],
  },
});

const inputForm = MemberAdditionWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "追加するメンバー",
    interactivity: MemberAdditionWorkflow.inputs.interactivity,
    submit_label: "追加",
    fields: {
      elements: [{
        name: "members",
        title: "メンバー",
        type: Schema.types.array,
        items: { type: Schema.slack.types.user_id },
      }],
      required: ["members"],
    },
  },
);

const additionStep = MemberAdditionWorkflow.addStep(
  MemberAdditionFunctionDefinition,
  {
    members: inputForm.outputs.fields.members,
  },
);

MemberAdditionWorkflow.addStep(Schema.slack.functions.SendEphemeralMessage, {
  channel_id: MemberAdditionWorkflow.inputs.channel,
  user_id: MemberAdditionWorkflow.inputs.interactivity.interactor.id,
  message: additionStep.outputs.message,
});

export default MemberAdditionWorkflow;
