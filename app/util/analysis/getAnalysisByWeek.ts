import { AudioData, MAIN_SERVER, TextClassification } from "../../typings"
import {BSON} from 'bson'
 
/*
    GETS ALL Analysis within a corresspodnign week based on a date 
*/
export async function getAnalysisByWeek(date: Date): Promise<TextClassification[] | null> { 
    
    return fetch(`${MAIN_SERVER}/api/analysis/get-all-by-week`, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            date: date
        })
    })
    .then(async (resp) => { 
        const body = await resp.json() as TextClassification[]

        console.log("TEST TEST TEST CLASSDADSASDAS", body)

        return body
    })
    .catch((e) => {
        console.error(e)
        return null
    })
}