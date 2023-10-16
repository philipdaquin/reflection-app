import {
    createParser,
    ParsedEvent,
    ReconnectInterval,
  } from "eventsource-parser";
import type { NextApiRequest, NextApiResponse } from 'next';

import useLocalStorage, { OPENAI_KEY } from "../../hooks/useLocalStorage";
  
  export type ChatGPTAgent = "user" | "system" | "assistant";
  
  export interface ChatGPTMessage {
    role: ChatGPTAgent;
    content: string;
  }
  
  // export interface OpenAIStreamPayload {
  //   model: string;
  //   messages: ChatGPTMessage[];
  //   temperature: number;
  //   top_p: number;
  //   frequency_penalty: number;
  //   presence_penalty: number;
  //   max_tokens: number;
  //   stream: boolean;
  //   n: number;
  // }
  
  export async function fetchOpenAI( 
      req: NextApiRequest,
      res: NextApiResponse,
      apiKey: string
    ) {
    
    const [openApiKey, ] = useLocalStorage<string | null>(OPENAI_KEY, null) 
  
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: req.body.messages,
      }),
    });
  
    const {choices, error } = await response.json();
    if (response.ok) { 
      if (choices?.length > 0) { 
        const message: ChatGPTMessage = { 
          content: choices[0].message.choice,
          role: 'system'
        }
        res.json(message)
      } else { 
        res.status(500).send(error.message)
      }
    } else { 
      res.status(500).send(error.message)
    }
  }