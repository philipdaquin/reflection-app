import { toast } from "react-hot-toast"
import { AudioData, MAIN_SERVER } from "../../typings"

/*
    Update the Audio file on server
*/
export async function updateEntry(audioData: AudioData): Promise<AudioData> { 

    return fetch(`${MAIN_SERVER}/api/audio/update-entry`, { 
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
        toast.error('Server Error. Try again later.')
        throw new Error(e)
    })
}