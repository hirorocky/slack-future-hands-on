import { Trigger } from "deno-slack-api/types.ts";
import MemberGroupingWorkflow from "../workflows/member_grouping_workflow.ts";

const memberGroupingTrigger: Trigger<typeof MemberGroupingWorkflow.definition> =
  {
    type: "shortcut",
    name: "メンバー分け",
    description: "シャッフルランチのメンバーを選出します",
    workflow: "#/workflows/member_grouping_workflow",
    inputs: {
      interactivity: {
        value: "{{data.interactivity}}",
      },
      channel: {
        value: "{{data.channel_id}}",
      },
    },
  };

export default memberGroupingTrigger;
