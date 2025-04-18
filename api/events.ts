import type { SlackEvent } from "@slack/web-api";
import { waitUntil } from "@vercel/functions";
import { verifyRequest, getBotId } from "../lib/slack-utils";
import { handleNewAppMentionChai } from '../lib/handle-app-mention-chai'
import {assistantThreadMessageChai, handleNewAssistantMessageChai} from '../lib/handle-message-chai'

export async function POST(request: Request) {
  const rawBody = await request.text();
  const payload = JSON.parse(rawBody);
  console.log(payload);
  const requestType = payload.type as "url_verification" | "event_callback";

  // See https://api.slack.com/events/url_verification
  if (requestType === "url_verification") {
    return new Response(payload.challenge, { status: 200 });
  }

  await verifyRequest({ requestType, request, rawBody });


  try {
    const botUserId = await getBotId();

    const event = payload.event as SlackEvent;

    if (event.type === "app_mention") {
      waitUntil(handleNewAppMentionChai(event, botUserId));
    }

    if (event.type === "assistant_thread_started") {
      waitUntil(assistantThreadMessageChai(event));
    }


    if (
      event.type === "message" &&
      !event.subtype &&
      event.channel_type === "im" &&
      !event.bot_id &&
      !event.bot_profile &&
      event.bot_id !== botUserId
    ) {
      waitUntil(handleNewAssistantMessageChai(event, botUserId));
    }

    return new Response("Success!", { status: 200 });
  } catch (error) {
    console.error("Error generating response", error);
    return new Response("Error generating response", { status: 500 });
  }
}