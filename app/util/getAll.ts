import { AudioData, TextClassification } from "../typings"
import {BSON} from 'bson'
 
/*
    GETS WEEKLY SUMMARY 
*/
export async function getAll(): Promise<AudioData[]> { 

    return fetch("http://localhost:4001/api/audio/get-all", {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(async (resp) => { 
        const body = await resp.json() as AudioData[]
        return body
    }).
    then((data: AudioData[]) => { 
        
        data.map((item) => item.text_classification as TextClassification)

        return data

    })
    .catch((e) => {
        throw new Error(e)
    })
}