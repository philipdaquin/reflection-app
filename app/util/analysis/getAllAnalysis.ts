import {BSON} from 'bson'
import { AudioData, TextClassification } from '../../typings'
 
/*
    GETS WEEKLY SUMMARY 
*/
export async function getAllAnalysis(): Promise<TextClassification[] | null> { 

    return fetch("http://localhost:4001/api/analysis/get-all", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async (resp) => { 
        const body = await resp.json() as TextClassification[]

        console.log("TEST TEST TEST CLASSDADSASDAS", body)

        return body
    })
    .catch((e) => {
        // throw new Error(e)
        console.error(e)
        return null
    })
}