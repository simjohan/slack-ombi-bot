import { App } from "@slack/bolt";
import requestCommand from "./requestCommand";

const register = (app: App) => {
  app.command("/request", requestCommand);
};

export default { register };
