import { AudioData, TextClassification } from "../typings"
import {BSON} from 'bson'
 
/*
    GETS WEEKLY SUMMARY 
*/
export async function getAllByDate(date: Date): Promise<AudioData[] | null> { 

    return fetch("http://localhost:4001/api/audio/get-all-by-date", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            date: date
        })
    })
    .then(async (resp) => { 
        const body = await resp.json() as AudioData[]
        return body
    }).
    then((data: AudioData[]) => { 
        
        data.map((item) => item.text_classification as TextClassification)
        console.log(data)
        return data

    })
    .catch((e) => {
        // throw new Error(e)
        console.error(e)
        return null
    })
}