import { AudioData } from "../../typings"

/*
    Update the Audio file on server
*/
export async function updateEntry(audioData: AudioData): Promise<AudioData> { 

    return fetch("http://localhost:4001/api/audio/update-entry", { 
        method: "PUT",
        headers: { 
            "Content-Type": "application/json"
        },
        body: JSON.stringify(audioData)
    }).then(async (resp) => { 
        const body = await resp.json() as AudioData
        console.log(body)
        return body
    })
    .catch(e => {
        console.error(e)
        throw new Error(e)
    })
}