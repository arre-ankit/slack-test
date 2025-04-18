import 'dotenv/config';
import Exa from 'exa-js';

// Exa search parameters
interface ExaSearchParams {
	query: string;
	domain: string;
	numResults?: number;
	useAutoprompt?: boolean;
}

// Exa search result
interface SearchResult {
	title: string | null;
	url: string;
	text: string;
	publishedDate?: string;
	highlights?: string[];
}

export async function searchInternet({
	query,
	domain,
	numResults,
	useAutoprompt,
}: ExaSearchParams) {
	try {
		const exa = new Exa(process.env.EXA_API_KEY);

		const searchResponse = await exa.searchAndContents(query, {
			text: true,
			highlight: true,
			type: `keyword`,
			includeDomains: [domain],
			numResults: numResults || 5,
			useAutoprompt: useAutoprompt || false,
		});

		// Transform search results into a formatted string for LLM
		const content = searchResponse.results.map(
			(result: SearchResult, index: number) => {
				// 1. Title
				let formattedResult = `${index + 1}. ${result.title}\n`;

				// 2. URL
				formattedResult += `URL: ${result.url}\n`;

				// 3. Published date
				if (result.publishedDate) {
					formattedResult += `Published: ${result.publishedDate}\n`;
				}

				// 4. Content and highlights
				formattedResult += `Content: ${result.text}\n`;
				if (result.highlights?.length) {
					formattedResult += `Relevant excerpts:\n`;
					result.highlights.forEach((highlight) => {
						formattedResult += `- ${highlight.trim()}\n`;
					});
				}

				// 5. Return the formatted result
				return formattedResult;
			}
		);

		return content.join(`\n\n`);
	} catch (error: any) {
		console.error(`Error performing search:`, error.message);
		return `Error performing search: ${error.message}`;
	}
}
