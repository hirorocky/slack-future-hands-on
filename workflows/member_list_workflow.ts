import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { MemberListFunctionDefinition } from "../functions/member_list_function.ts";

const MemberListWorkflow = DefineWorkflow({
  callback_id: "member_list_workflow",
  title: "メンバー一覧",
  description: "シャッフルランチのメンバーを一覧表示します",
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

const listStep = MemberListWorkflow.addStep(
  MemberListFunctionDefinition,
  {},
);

MemberListWorkflow.addStep(Schema.slack.functions.SendEphemeralMessage, {
  channel_id: MemberListWorkflow.inputs.channel,
  user_id: MemberListWorkflow.inputs.interactivity.interactor.id,
  message: listStep.outputs.message,
});

export default MemberListWorkflow;
