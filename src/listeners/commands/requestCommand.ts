import { AllMiddlewareArgs, SlackCommandMiddlewareArgs } from "@slack/bolt";
import { WebClient } from "@slack/web-api";
import { Logger } from "@slack/logger";
import searchMedia from "../../ombi/ombi";
import { SearchReponse } from "../../ombi/models";

const requestMedia = async ({
  ack,
  payload,
  client,
  logger,
}: AllMiddlewareArgs & SlackCommandMiddlewareArgs) => {
  try {
    await ack();

    const searchTerm = payload.text;
    const result = await searchMedia(searchTerm);
    const limited = result.slice(0, 5);
    await openModalWithImageSections(
      payload.trigger_id,
      client,
      logger,
      limited
    );
  } catch (error) {
    console.error(error);
  }
};

async function openModalWithImageSections(
  triggerId: string,
  client: WebClient,
  logger: Logger,
  media: SearchReponse[]
) {
  try {
    const result = await client.views.open({
      trigger_id: triggerId,
      view: {
        type: "modal",
        callback_id: "view_1",
        title: {
          type: "plain_text",
          text: "Results",
        },
        blocks: [
          ...media.flatMap((m) => {
            const previewText =
              m.overview?.slice(0, 300) +
                (m.overview && m.overview.length >= 300 ? " [...]" : "") || "";
            return [
              {
                type: "section",
                text: {
                  type: "mrkdwn",
                  text: `*${m.title}* \n ${previewText}`,
                },
                accessory: {
                  type: "image",
                  image_url: `https://image.tmdb.org/t/p/w200/${m.poster}`,
                  alt_text: m.title,
                },
              },
              {
                type: "actions",
                elements: [
                  {
                    type: "button",
                    action_id: "request_media_action",
                    text: {
                      type: "plain_text",
                      text: "Request",
                    },
                    value: m.id!.toString(),
                  },
                ],
              },
              {
                type: "divider",
              },
            ];
          }),
        ],
        close: {
          type: "plain_text",
          text: "Abort mission",
        },
      },
    });
    logger.info(result);
  } catch (error) {
    logger.error(error);
  }
}

export default requestMedia;
