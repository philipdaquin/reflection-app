import useLocalStorage, { OPENAI_KEY } from "../../hooks/useLocalStorage";
import { WeeklySummary } from "../../typings"

 
/*
    GETS WEEKLY SUMMARY 
*/
export async function getCurrentWeeklySummary(): Promise<WeeklySummary | null> { 
    return fetch("http://localhost:4001/api/weekly/get-current-week", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(async (resp) => { 
        const body = await resp.json() as WeeklySummary
        console.log(body)
        return body
    })
    .catch((e) => {
        console.error(e)
        return null
    })
}