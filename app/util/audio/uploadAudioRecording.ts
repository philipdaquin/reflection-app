import useLocalStorage, { OPENAI_KEY } from "../../hooks/useLocalStorage";
import { AudioData, MAIN_SERVER } from "../../typings";

// Send the WAV fle to the server 
// Updates both DailySummary and WeeklySummary
/* 
 ```
 
 ```
*/
export async function uploadAudioRecording(formData: FormData, apiKey: string, ): Promise<AudioData> {

    
    console.log("Unploading to server")
    // const formData = new FormData();
    // formData.append('audio', wavFile);
    // const [apiKey, ] = useLocalStorage<string | null>(OPENAI_KEY, null)
    if (apiKey === null) throw new Error("Failed to get Open AI key")
    console.log("APIKEY", apiKey)

    const headers = {
      'Authorization': `Bearer ${apiKey}`,
    };

    return fetch(`${MAIN_SERVER}/api/audio/batch-upload`, {
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