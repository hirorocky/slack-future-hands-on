import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { MemberGroupingFunctionDefinition } from "../functions/member_grouping_function.ts";

const MemberGroupingWorkflow = DefineWorkflow({
  callback_id: "member_grouping_workflow",
  title: "メンバー分け",
  description: "シャッフルランチのメンバーを選出します",
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

const inputForm = MemberGroupingWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "メンバー選出",
    interactivity: MemberGroupingWorkflow.inputs.interactivity,
    submit_label: "選出",
    fields: {
      elements: [
        {
          name: "countOfFourMemberGroups",
          title: "4人グループ数",
          type: Schema.types.integer,
        },
        {
          name: "countOfThreeMemberGroups",
          title: "3人グループ数",
          type: Schema.types.integer,
        },
      ],
      required: ["countOfFourMemberGroups", "countOfThreeMemberGroups"],
    },
  },
);

const groupingStep = MemberGroupingWorkflow.addStep(
  MemberGroupingFunctionDefinition,
  {
    countOfFourMemberGroups: inputForm.outputs.fields.countOfFourMemberGroups,
    countOfThreeMemberGroups: inputForm.outputs.fields.countOfThreeMemberGroups,
  },
);

MemberGroupingWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: MemberGroupingWorkflow.inputs.channel,
  message: groupingStep.outputs.message,
});

export default MemberGroupingWorkflow;
