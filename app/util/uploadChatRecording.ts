import { getElevenLabsAPIKey, getOpenAPIKey } from "../pages"

// Send the WAV fle to the server 
export async function uploadChatRecording(wavFile: Blob): Promise<Blob> {

    
    const elevenLabsApiKey = getElevenLabsAPIKey()
    const apiKey = getOpenAPIKey()

    
    if (elevenLabsApiKey === null) throw new Error("Failed to get Open AI key")

    if (apiKey === null) throw new Error("Failed to get Open AI key")

    const headers = {
        'X-API-KEY-OPENAI': apiKey,
        'X-API-KEY-ELEVENLABS': elevenLabsApiKey,
    }

    const formData = new FormData();
    formData.append('audio', wavFile, 'recording.wav')

    return fetch("http://localhost:4001/api/audio/upload", {
      method: "POST",
      body: formData,
      headers
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