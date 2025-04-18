import type { AssistantThreadStartedEvent, GenericMessageEvent } from "@slack/web-api";
import { client, getThreadLangBase, updateStatusUtil } from "./slack-utils";
import { generateResponseLangBase } from "./generate-response-langbase";
  
export async function assistantThreadMessageChai(event: AssistantThreadStartedEvent) {
const { channel_id, thread_ts } = event.assistant_thread;
	console.log(`Thread started: ${channel_id} ${thread_ts}`);
	console.log(JSON.stringify(event));
	
	await client.chat.postMessage({
		channel: channel_id,
		thread_ts: thread_ts,
		text: "Hello, I'm an Chai Agent!"
    });
  
}
  
export async function handleNewAssistantMessageChai(
	event: GenericMessageEvent,
	botUserId: string,
  ) {
	if (
		event.bot_id ||
		event.bot_id === botUserId ||
		event.bot_profile ||
		!event.thread_ts
    )
    return;
  
	const { thread_ts, channel } = event;
	const updateStatus = updateStatusUtil(channel, thread_ts);
	updateStatus("is thinking...");

	const messages = await getThreadLangBase(channel, thread_ts, botUserId);
	console.log(messages);
    const result = await generateResponseLangBase(messages, updateStatus);
  
    await client.chat.postMessage({
		channel: channel,
		thread_ts: thread_ts,
		text: result,
		unfurl_links: false,
		blocks: [
			{
				type: "section",
				text: {
					type: "mrkdwn",
					text: result,
				},
			},
      	],
    });
  
    updateStatus("");
}
  