import { MAIN_SERVER } from "../../typings"

 
/*
    GETS TEXT SUMMARY FROM SERVER
*/
export async function getRelatedTags(input: string): Promise<string[] | null> { 

    return fetch(`${MAIN_SERVER}/api/audio/tags`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            value: input
        })
    })
    .then(async (resp) => { 
        const body = await resp.json() as string[]
        return body
    })
    .catch((e) => {
        console.error(e)
        return null
    })
}