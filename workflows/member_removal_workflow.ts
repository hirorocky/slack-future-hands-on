import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { MemberRemovalFunctionDefinition } from "../functions/member_removal_function.ts";

const MemberRemovalWorkflow = DefineWorkflow({
  callback_id: "member_removal_workflow",
  title: "メンバー削除",
  description: "シャッフルランチのグループ作成メンバーを削除します",
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

const inputForm = MemberRemovalWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "削除するメンバー",
    interactivity: MemberRemovalWorkflow.inputs.interactivity,
    submit_label: "削除",
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

const removalStep = MemberRemovalWorkflow.addStep(
  MemberRemovalFunctionDefinition,
  {
    members: inputForm.outputs.fields.members,
  },
);

MemberRemovalWorkflow.addStep(Schema.slack.functions.SendEphemeralMessage, {
  channel_id: MemberRemovalWorkflow.inputs.channel,
  user_id: MemberRemovalWorkflow.inputs.interactivity.interactor.id,
  message: removalStep.outputs.message,
});

export default MemberRemovalWorkflow;
