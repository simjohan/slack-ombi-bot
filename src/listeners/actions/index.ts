import { App } from "@slack/bolt";
import requestMediaAction from "./requestMediaAction";

const register = (app: App) => {
  app.action("request_media_action", requestMediaAction);
};

export default { register };
