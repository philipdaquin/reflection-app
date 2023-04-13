import { getOpenAPIKey } from "../hooks/useLocalStorage";

// Send the WAV fle to the server 
export async function uploadWav(wavFile: Blob): Promise<boolean> {

    const openAPI = getOpenAPIKey()
    


    const data = new FormData();

    data.append('audio', wavFile, 'recording.wav')

    try { 
        const resp = await fetch('http://localhost:4001/audio/upload', { 
            method: 'POST',
            body: JSON.stringify({
                
            })
        });

        if (resp.ok) console.log('File uploaded successfully')
        else { console.error('Failed to upload file')}
    } catch(e) { 
        console.error(e)
    }

    return true
}