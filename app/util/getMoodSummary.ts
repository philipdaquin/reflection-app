import { TextClassification } from "../typings"

export async function getMoodSummary(): Promise<TextClassification[] | null> { 
    return fetch('http://localhost:4001/api/analysis/get-mood-summary', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
        
    })
    .then(async (resp) => { 
        const body = await resp.json() as TextClassification[]
        console.log(body)
        return body
    })
    .catch((e) => {
        console.error(e)
        // throw new Error(e)
        return null
    })
}