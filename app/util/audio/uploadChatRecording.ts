import useLocalStorage, { ELEVEN_LABS_KEY, OPENAI_KEY } from "../../hooks/useLocalStorage"
import { MAIN_SERVER } from "../../typings"

// Send the WAV fle to the server 
export async function uploadChatRecording(wavFile: Blob): Promise<Blob> {

    
    const elevenLabsApiKey = useLocalStorage(ELEVEN_LABS_KEY, null)
    const apiKey = useLocalStorage(OPENAI_KEY, null)

    
    if (elevenLabsApiKey === null) throw new Error("Failed to get Open AI key")

    if (apiKey === null) throw new Error("Failed to get Open AI key")

    const headers = {
        'X-API-KEY-OPENAI': apiKey,
        'X-API-KEY-ELEVENLABS': elevenLabsApiKey,
    }

    const formData = new FormData();
    formData.append('audio', wavFile, 'recording.wav')

    return fetch(`${MAIN_SERVER}/api/audio/upload`, {
      method: "POST",
      body: formData,
    //   headers,
    })
    .then(async (response) => {

        if (response.ok) { 
            const audioData = await response.blob()
            console.log(audioData)
            return audioData
        } else { 
          throw new Error("Failed to get audio file")
        }

    })
    .catch((e) => { 
        console.error(e)
        throw new Error(e)
    }) 
}