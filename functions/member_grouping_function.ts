import { EArray } from "https://deno.land/x/earray@1.0.0/mod.ts";
import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import MemberDataStore from "../datastores/members.ts";

export const MemberGroupingFunctionDefinition = DefineFunction({
  callback_id: "member_grouping_function",
  title: "Make member groups",
  description: "member grouping function",
  source_file: "functions/member_grouping_function.ts",
  input_parameters: {
    properties: {
      countOfFourMemberGroups: {
        type: Schema.types.integer,
        description: "Count of four member groups",
      },
      countOfThreeMemberGroups: {
        type: Schema.types.integer,
        description: "Count of three member groups",
      },
    },
    required: ["countOfFourMemberGroups", "countOfThreeMemberGroups"],
  },
  output_parameters: {
    properties: {
      message: {
        type: Schema.types.string,
        description: "process message",
      },
    },
    required: ["message"],
  },
});

export default SlackFunction(
  MemberGroupingFunctionDefinition,
  async ({ inputs, client }) => {
    let group_number = 1;
    let message = "";
    const result = await client.apps.datastore.query<
      typeof MemberDataStore.definition
    >(
      {
        datastore: MemberDataStore.name,
      },
    );

    const members = result.items.map((item) => {
      return item.user_id;
    });

    const shuffled_members = EArray(members).shuffle();
    const countOfFourMemberGroups = inputs.countOfFourMemberGroups;
    for (let i = 0; i < countOfFourMemberGroups; i++) {
      message = message.concat(`＜グループ${group_number}＞\n`);

      for (let j = 0; j < 4; j++) {
        const member = shuffled_members.pop();
        if (j == 0) {
          message = message.concat(`リーダー：<@${member}>\n`);
        } else {
          message = message.concat(`<@${member}>`);
        }
      }
      group_number++;
    }

    const countOfThreeMemberGroups = inputs.countOfThreeMemberGroups;
    for (let i = 0; i < countOfThreeMemberGroups; i++) {
      message = message.concat(`\n＜グループ${group_number}＞\n`);

      for (let j = 0; j < 3; j++) {
        const member = shuffled_members.pop();
        if (j == 0) {
          message = message.concat(`リーダー：<@${member}>\n`);
        } else {
          message = message.concat(`<@${member}>`);
        }
      }
      group_number++;
    }

    return { outputs: { message: message } };
  },
);
