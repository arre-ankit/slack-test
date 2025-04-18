import { langbase } from "./utils";
import { Message } from "langbase";


export const generateResponseLangBase = async (
  messages: any[],
  updateStatus?: (status: string) => void,
) => {
	
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
