import useLocalStorage, { OPENAI_KEY } from "../../hooks/useLocalStorage";
import { MAIN_SERVER, WeeklySummary } from "../../typings"

 
/*
    GETS WEEKLY SUMMARY 
*/
export async function getWeeklySummary(): Promise<WeeklySummary | null> { 
    return fetch(`${MAIN_SERVER}/api/weekly/get-weekly-summary`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(async (resp) => { 
        const body = await resp.json() as WeeklySummary
        // console.log(body)
        return body
    })
    .catch((e) => {
        console.error(e)
        return null
    })
}