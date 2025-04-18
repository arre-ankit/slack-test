'use server'

import { langbase } from "./utils";

export const generateResponseLangBase = async (
  	messages: any[],
  	updateStatus?: (status: string) => void,
) => {
	await langbase.pipes.create({
		name: 'support-agent',
		description: 'A support agent that can help with customer inquiries',
		upsert: true,
		messages:[
			{
				role: 'system',
				content: 'You are a helpful assistant'
			}
		]

	})
	
	const response = await langbase.pipes.run({
		name: 'support-agent',
		stream: false,
		messages: [
			{
				role: 'user',
				content: messages.map(m => m.content).join('\n')
			}
		]
	})

	const completion = response.completion

	return completion

};
