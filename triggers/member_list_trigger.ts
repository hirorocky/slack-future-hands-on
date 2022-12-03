import { Trigger } from "deno-slack-api/types.ts";
import MemberListWorkflow from "../workflows/member_list_workflow.ts";

const memberListTrigger: Trigger<typeof MemberListWorkflow.definition> = {
  type: "shortcut",
  name: "メンバーを一覧",
  description: "シャッフルランチのメンバーを一覧表示します",
  workflow: "#/workflows/member_list_workflow",
  inputs: {
    interactivity: {
      value: "{{data.interactivity}}",
    },
    channel: {
      value: "{{data.channel_id}}",
    },
  },
};

export default memberListTrigger;
