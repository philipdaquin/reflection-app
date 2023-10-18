import { AudioData, MAIN_SERVER } from "../../typings"

export async function getEntry(id: string): Promise<AudioData | null> { 
    console.log(id)
    return fetch(`${MAIN_SERVER}/api/audio/get-entry`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            _id: id
        })
    })
    .then(async (resp) => { 
        const body = await resp.json() as AudioData
        console.log(body)
        return body
    })
    .catch((e) => {
        console.error(e)
        // throw new Error(e)
        return null
    })
}