import { AudioData } from "../typings";

// Send the WAV fle to the server 
export async function uploadAudioRecording(wavFile: Blob): Promise<AudioData> {


    console.log("Unploading to server")

    const formData = new FormData();
    formData.append('audio', wavFile);
      
    return fetch("http://localhost:4001/api/audio/upload", {
      method: "POST",
      body: formData,
    })
    .then(async (response) => {
        const audioData = await response.json() as AudioData
        console.log(audioData)
        return audioData
    })
    .catch((e) => { 
        console.error(e)
        throw new Error("Failed to upload audio file")
    }) 
}