import { WeeklySummary } from "../typings"

 
/*
    GETS WEEKLY SUMMARY 
*/
export async function getWeeklySummary(): Promise<WeeklySummary> { 

    return fetch("http://localhost:4001/api/weekly/get-weekly-summary", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async (resp) => { 
        const body = await resp.json() as WeeklySummary
        console.log(body)
        return body
    })
    .catch((e) => {
        throw new Error(e)
    })
}