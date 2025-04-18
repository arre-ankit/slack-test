import Exa from "exa-js";
import { Langbase } from "langbase";


export const exa = new Exa(process.env.EXA_API_KEY);

export const langbase = new Langbase({
    apiKey: process.env.LANGBASE_API_KEY!,
});
