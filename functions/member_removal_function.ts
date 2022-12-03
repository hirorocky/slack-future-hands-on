import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import MemberDataStore from "../datastores/members.ts";

export const MemberRemovalFunctionDefinition = DefineFunction({
  callback_id: "member_removal_function",
  title: "Remove member",
  description: "member removal function",
  source_file: "functions/member_removal_function.ts",
  input_parameters: {
    properties: {
      members: {
        type: Schema.types.array,
        items: {
          type: Schema.slack.types.user_id,
        },
        description: "Members to be removed",
      },
    },
    required: ["members"],
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
  MemberRemovalFunctionDefinition,
  async ({ inputs, client }) => {
    const { members } = inputs;
    let message = "";
    for (const member of members) {
      const membersToBeRemoved = await client.apps.datastore.query<
        typeof MemberDataStore.definition
      >(
        {
          datastore: MemberDataStore.name,
          expression: "#user_id = :user_id",
          expression_attributes: { "#user_id": "user_id" },
          expression_values: { ":user_id": member },
        },
      );

      // 処理上user_idは重複しないはずだが、ユニークキー制約がないので
      for (const item of membersToBeRemoved.items) {
        await client.apps.datastore.delete<
          typeof MemberDataStore.definition
        >(
          {
            datastore: MemberDataStore.name,
            id: item.id,
          },
        );
      }
      message = message.concat(`<@${member}> `);
    }

    message = message.concat("を削除しました");

    return { outputs: { message: message } };
  },
);
