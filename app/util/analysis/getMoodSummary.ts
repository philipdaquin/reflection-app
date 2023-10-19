import { MAIN_SERVER, TextClassification } from "../../typings"

export async function getMoodSummary(): Promise<TextClassification[] | null> { 
    return fetch(`${MAIN_SERVER}/api/analysis/get-mood-summary`, {
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
        return null
    })
}