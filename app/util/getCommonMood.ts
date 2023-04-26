import { TopMood } from "../typings"

export async function getCommonMood(): Promise<TopMood[] | null> { 
    return fetch('http://localhost:4001/api/analysis/get-common-mood', {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
        
    })
    .then(async (resp) => { 
        const body = await resp.json() as TopMood[]
        // console.log(body)
        return body
    })
    .catch((e) => {
        console.error(e)
        // throw new Error(e)
        return null
    })
}