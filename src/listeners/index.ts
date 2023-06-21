import { App } from "@slack/bolt";
import commands from "./commands";
import actions from "./actions";

const registerListeners = (app: App) => {
  commands.register(app);
  actions.register(app);
};

export default registerListeners;
