import { DailySummary, MoodFrequency, WeeklySummary } from "../../typings"

 
/*
    Endpoint to the find the given week that a `Date` is on and returns the weekly summary 

    ```
    const [previousWeek, setPreviousWeek] = useState<WeeklySummary | null>(null)
        const oneWeek = async (date: Date) => { 
            const lastWeek = await getWeeklyByDate(date)
            setPreviousWeek(lastWeek || null)
        }
        
        useEffect(() => {
        let currentDate = new Date()
        let oneWeekAgo = new Date(
            currentDate.getFullYear(), 
            currentDate.getMonth(), 
            currentDate.getDate() - currentDate.getDay() - 7)
            oneWeek(oneWeekAgo)
        }, [])
    
    ```
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