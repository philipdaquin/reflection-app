import { AudioData } from "../typings"

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
        if (!resp.ok) throw new Error('Unable to update the AudioData')
        return await resp.json()
    })
    .catch(e => [ 
        console.error(e)
    ])
}