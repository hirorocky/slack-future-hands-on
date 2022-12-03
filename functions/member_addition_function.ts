import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import MemberDataStore from "../datastores/members.ts";

export const MemberAdditionFunctionDefinition = DefineFunction({
  callback_id: "member_addition_function",
  title: "Add member",
  description: "member addition function",
  source_file: "functions/member_addition_function.ts",
  input_parameters: {
    properties: {
      members: {
        type: Schema.types.array,
        items: {
          type: Schema.slack.types.user_id,
        },
        description: "Members to be added",
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
  MemberAdditionFunctionDefinition,
  async ({ inputs, client }) => {
    const { members } = inputs;
    let message = "";
    for (const member of members) {
      const membersToBeAdded = await client.apps.datastore.query<
        typeof MemberDataStore.definition
      >(
        {
          datastore: MemberDataStore.name,
          expression: "#user_id = :user_id",
          expression_attributes: { "#user_id": "user_id" },
          expression_values: { ":user_id": member },
        },
      );

      if (membersToBeAdded.items.length > 0) {
        continue;
      }

      const result = await client.apps.datastore.put<
        typeof MemberDataStore.definition
      >(
        {
          datastore: MemberDataStore.name,
          item: {
            id: crypto.randomUUID(),
            user_id: member,
          },
        },
      );
      if (result.ok) {
        message = message.concat(`<@${member}> `);
      }
    }

    message = message.concat("を登録しました");

    return { outputs: { message: message } };
  },
);
