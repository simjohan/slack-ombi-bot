import {
  AllMiddlewareArgs,
  BlockAction,
  ButtonAction,
  SlackActionMiddlewareArgs,
} from "@slack/bolt";
import { requestMovie } from "../../ombi/ombi";

const MEDIA_SERVER_CHANNEL_ID = "C04R8A9GYBA";

// Denne trigges når man trykker på request-knapp i modalen
const requestMediaAction = async ({
  ack,
  body,
  client,
  logger,
  say,
}: AllMiddlewareArgs &
  Omit<SlackActionMiddlewareArgs, "body"> & {
    body: Omit<BlockAction, "actions"> & { actions: ButtonAction[] };
  }) => {
  try {
    console.log(body.user.name);
    // console.log(payload);
    await ack();
    const mediaId = body.actions[0].value;

    const requestEngineResult = await requestMovie(mediaId, body.user.name);

    const result = await client.views.update({
      trigger_id: body.trigger_id,
      view_id: body!.view!.id,
      view: {
        type: "modal",
        callback_id: "view_1",
        title: {
          type: "plain_text",
          text: "Requested movie",
        },
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: requestEngineResult.result
                ? `${requestEngineResult.message} (${body.user.name})`
                : `Request failed: ${requestEngineResult.errorMessage}`,
            },
          },
        ],
        close: {
          type: "plain_text",
          text: "Close",
        },
      },
    });
    await client.chat.postMessage({
      channel: MEDIA_SERVER_CHANNEL_ID,
      text: `:movie_camera: ${requestEngineResult.message} (${body.user.name})`,
    });
    logger.info(result);
  } catch (error) {
    logger.error(error);
  }
};

export default requestMediaAction;
