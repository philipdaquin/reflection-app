import {BSON} from 'bson'
import { AudioData, MAIN_SERVER, TextClassification } from '../../typings'
 
/*
    GETS WEEKLY SUMMARY 
*/
export async function getCurrentWeek(): Promise<AudioData[] | null> { 

    return fetch(`${MAIN_SERVER}/api/audio/get-current-week`, {
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
        // throw new Error(e)
        console.error(e)
        return null
    })
}