import { MoodFrequency } from "../../typings"

export async function getCommonMood(): Promise<MoodFrequency[] | null> { 
    return fetch('http://localhost:4001/api/analysis/get-common-mood', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
        
    })
    .then(async (resp) => { 
        const body = await resp.json() as MoodFrequency[]
        // console.log(body)
        return body
    })
    .catch((e) => {
        console.error(e)
        // throw new Error(e)
        return null
    })
}