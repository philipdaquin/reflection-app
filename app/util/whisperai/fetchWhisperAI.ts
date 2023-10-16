import useLocalStorage, { OPENAI_KEY } from "../../hooks/useLocalStorage";
import { AudioData } from "../../typings";


type ObjectResponse = { 
    text: string,
    error: Error
}


export async function fetchWhisperAI(formData: FormData, apiKey: string): Promise<String> { 
    const headers = {
        'Authorization': `Bearer ${apiKey}`,
    };
    const [openApiKey, ] = useLocalStorage<string | null>(OPENAI_KEY, null) 

    return fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    })
    .then(async (response) => {

        if (response.ok) { 
            const {text, error} = await response.json() as ObjectResponse
            console.log(text)
            return text
        } else { 
          throw new Error("Failed to get audio file")
        }

    })
    .catch((e) => { 
        console.error(e)
        throw new Error(e)
    }) 
}