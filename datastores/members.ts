import { DefineDatastore, Schema } from "deno-slack-sdk/mod.ts";

export const DATASTORE_NAME = "members";

const MemberDatastore = DefineDatastore({
  name: DATASTORE_NAME,
  primary_key: "id",
  attributes: {
    id: {
      type: Schema.types.string,
    },
    user_id: {
      type: Schema.slack.types.user_id,
    },
  },
});

export default MemberDatastore;
