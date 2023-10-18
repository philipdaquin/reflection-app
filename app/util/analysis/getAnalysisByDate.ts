import { AudioData, TextClassification } from "../../typings"
import {BSON} from 'bson'
 
/*
    GETS ALL Analysis by Date (to support Weekly Calendar) 
*/
export async function getAnalysisByDate(date: Date): Promise<TextClassification[] | null> { 
    
    // return fetch(`${MAIN_SERVER}/api/analysis/get-all-by-date`, {
    //     method: "POST",
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //         date: date
    //     })
    // })
    // .then(async (resp) => { 
    //     const body = await resp.json() as TextClassification[]

    //     console.log("TEST TEST TEST CLASSDADSASDAS", body)

    //     return body
    // })
    // .catch((e) => {
    //     console.error(e)
    //     return null
    // })
    return null
}