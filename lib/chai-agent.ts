// 'use server'
// import { Message } from "langbase";

// export const chaiAgent = async (messages: Message[]) => {
//     const userName = process.env.USER_NAME;
//     const agentName = process.env.AGENT_NAME;
//     const api = `https://staging-api.langbase.com/${userName}/${agentName}`;
//     const response = await fetch(api, {
//         method: 'POST',
//         headers: {
//             'Authorization': `Bearer ${process.env.LANGBASE_API_KEY}`,
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({"input":messages})
//     });

//     if (!response.ok) {
//         throw new Error(`Error: ${response.statusText}`);
//     }

//     const agentResponse = await response.json();
//     console.log('Agent response:', agentResponse);
//     return agentResponse;
// }
