import { getOpenAPIKey } from "../hooks/useLocalStorage";
import { AudioData } from "../typings";

// Send the WAV fle to the server 
export async function uploadAudioRecording(wavFile: Blob): Promise<AudioData> {

    
    console.log("Unploading to server")

    const formData = new FormData();
    formData.append('audio', wavFile);
    
    const apiKey = getOpenAPIKey()
    if (apiKey === null) throw new Error("Failed to get Open AI key")

    const headers = {
      'X-API-KEY-OPENAI': apiKey,
      'Content-Type': 'multipart/form-data'
    }

    return fetch("http://localhost:4001/api/audio/upload", {
      method: "POST",
      body: formData,
      headers
    })
    .then(async (response) => {

        if (response.ok) { 
            const audioData = await response.json() as AudioData
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