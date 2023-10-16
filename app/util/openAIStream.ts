import {
    createParser,
    ParsedEvent,
    ReconnectInterval,
  } from "eventsource-parser";


const OPEN_API_URL = "https://api.openai.com/v1/chat/completions"

export type ChatGPTAgent = "user" | "system"

export interface ChatGPTMessage { 
    role: ChatGPTAgent;
    content: string; 
}

export interface OpenAIStreamPayload { 
    model: string;
    messages: ChatGPTMessage[];
    temperature: number;
    top_p: number;
    frequency_penalty: number; 
    presence_penalty: number;
    max_tokens: number;
    stream: boolean; 
    n: number;
}

export async function OpenAIStream(payload: OpenAIStreamPayload) { 
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const res = await fetch(OPEN_API_URL, { 
        headers: { 
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
        },
        method: "POST",
        body: JSON.stringify(payload)
    });

}