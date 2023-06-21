import * as dotenv from "dotenv";
dotenv.config();
import { App, LogLevel } from "@slack/bolt";
import registerListeners from "./listeners";
import { hostname } from "os";

/** Initialization */
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  //   signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
  logLevel: LogLevel.DEBUG,
});

/** Register Listeners */
registerListeners(app);

/** Start Bolt App */
(async () => {
  try {
    const port = process.env.PORT || 3000;
    await app.start(port);
    console.log(`⚡️ Bolt app is running on ${hostname}:${port} ! ⚡️`);
  } catch (error) {
    console.error("Unable  to start App", error);
  }
})();
