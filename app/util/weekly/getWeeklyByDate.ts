import { DailySummary, MoodFrequency, WeeklySummary } from "../../typings"

 
/*
    GETS WEEKLY SUMMARY 
*/
export async function getWeeklyByDate(date: Date): Promise<WeeklySummary | null> { 

    return fetch("http://localhost:4001/api/weekly/get-by-date", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            date: date
        })
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