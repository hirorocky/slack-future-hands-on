import { Manifest } from "deno-slack-sdk/mod.ts";
import MemberAdditionWorkflow from "./workflows/member_addition_workflow.ts";
import MemberRemovalWorkflow from "./workflows/member_removal_workflow.ts";
import MemberListWorkflow from "./workflows/member_list_workflow.ts";
import MemberDatastore from "./datastores/members.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "shuffle_lunch_grouping",
  description: "An app for making shuffle lunch group",
  icon: "assets/default_new_app_icon.png",
  workflows: [
    MemberAdditionWorkflow,
    MemberRemovalWorkflow,
    MemberListWorkflow,
  ],
  datastores: [MemberDatastore],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
  ],
});
