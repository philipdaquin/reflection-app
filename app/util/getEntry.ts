import { AudioData } from "../pages"

export async function getEntry(id: string): Promise<AudioData> { 

    return fetch("http://localhost:4001/api/get-entry", {
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
        throw new Error(e)
    })
}