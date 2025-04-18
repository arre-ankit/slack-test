import { AppMentionEvent } from "@slack/web-api";
import { client, getThreadLangBase, getChannelMessages } from "./slack-utils";
import { generateResponseLangBase } from "./generate-response-langbase";

const updateStatusUtil = async (
  initialStatus: string,
  event: AppMentionEvent,
) => {
  const initialMessage = await client.chat.postMessage({
    channel: event.channel,
    thread_ts: event.thread_ts ?? event.ts,
    text: initialStatus,
  });

  if (!initialMessage || !initialMessage.ts)
    throw new Error("Failed to post initial message");

  const updateMessage = async (status: string) => {
    await client.chat.update({
      channel: event.channel,
      ts: initialMessage.ts as string,
      text: status,
    });
  };
  return updateMessage;
};

export async function handleNewAppMentionChai(
  event: AppMentionEvent,
  botUserId: string,
) {
  console.log("Handling app mention");
  if (event.bot_id || event.bot_id === botUserId || event.bot_profile) {
    console.log("Skipping app mention");
    return;
  }

  const { thread_ts, channel } = event;
  const updateMessage = await updateStatusUtil("is thinking...", event);

  if (thread_ts) {
    const messages = await getThreadLangBase(channel, thread_ts, botUserId);
    console.log(messages);
    const result = await generateResponseLangBase(messages, updateMessage);
    await updateMessage(result);
  } else {
    const channelMessages = await getChannelMessages(channel);
    console.log(channelMessages);
    const result = await generateResponseLangBase(
      [{ role: "user", content: `Here are the messages in the channel: ${JSON.stringify(channelMessages)}`}],
      updateMessage,
    );
    await updateMessage(result);
  }
}