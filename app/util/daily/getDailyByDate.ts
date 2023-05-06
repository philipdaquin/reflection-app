import { DailySummary, MoodFrequency, WeeklySummary } from "../../typings"

 
/*
    GETS WEEKLY SUMMARY 
*/
export async function getDailyByDate(date: Date): Promise<DailySummary | null> { 

    return fetch("http://localhost:4001/api/daily/get-by-date", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            date: date
        })
    })
    .then(async (resp) => { 
        const body = await resp.json() as DailySummary
        console.log(body)
        return body
    })
    .then((data: DailySummary) => { 
        
        data.mood_frequency.map((item) => item as MoodFrequency)

        return data

    })
    .catch((e) => {
        console.error(e)
        return null
    })
}