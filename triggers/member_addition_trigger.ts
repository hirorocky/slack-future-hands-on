import { Trigger } from "deno-slack-api/types.ts";
import MemberAdditionWorkflow from "../workflows/member_addition_workflow.ts";

const memberAdditionTrigger: Trigger<typeof MemberAdditionWorkflow.definition> =
  {
    type: "shortcut",
    name: "メンバーを追加",
    description: "シャッフルランチのメンバーを追加します",
    workflow: "#/workflows/member_addition_workflow",
    inputs: {
      interactivity: {
        value: "{{data.interactivity}}",
      },
      channel: {
        value: "{{data.channel_id}}",
      },
    },
  };

export default memberAdditionTrigger;
