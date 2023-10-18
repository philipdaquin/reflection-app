import { MAIN_SERVER } from "../../typings"

 
/*
    GETS TEXT SUMMARY FROM SERVER
*/
export async function getTextSummary(input: string): Promise<string | null> { 

    return fetch(`${MAIN_SERVER}/api/audio/summary`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            value: input
        })
    })
    .then(async (resp) => { 
        return await resp.text()
    })
    .catch((e) => {
        console.error(e)
        return null
    })
}