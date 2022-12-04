import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";
import MemberDataStore from "../datastores/members.ts";

export const MemberListFunctionDefinition = DefineFunction({
  callback_id: "member_list_function",
  title: "List up member",
  description: "member list function",
  source_file: "functions/member_list_function.ts",
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
  MemberListFunctionDefinition,
  async ({ client }) => {
    const result = await client.apps.datastore.query<
      typeof MemberDataStore.definition
    >(
      {
        datastore: MemberDataStore.name,
      },
    );
    const items = result.items;
    let message = `登録されているメンバー(計${items.length}名)：`;
    for (const item of items) {
      message = message.concat(`<@${item.user_id}> `);
    }

    return { outputs: { message: message } };
  },
);
