import { Trigger } from "deno-slack-api/types.ts";
import MemberRemovalWorkflow from "../workflows/member_removal_workflow.ts";

const memberRemovalTrigger: Trigger<typeof MemberRemovalWorkflow.definition> = {
  type: "shortcut",
  name: "メンバーを削除",
  description: "シャッフルランチのメンバーを削除します",
  workflow: "#/workflows/member_removal_workflow",
  inputs: {
    interactivity: {
      value: "{{data.interactivity}}",
    },
    channel: {
      value: "{{data.channel_id}}",
    },
  },
};

export default memberRemovalTrigger;
