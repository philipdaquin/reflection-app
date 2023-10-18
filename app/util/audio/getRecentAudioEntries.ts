import { AudioData, MAIN_SERVER, TextClassification } from "../../typings"
import {BSON} from 'bson'
 
/*
    GETS WEEKLY SUMMARY 
*/
export async function getRecentAudioEntries(): Promise<AudioData[] | null> { 

    return fetch(`${MAIN_SERVER}/api/audio/get-recent`, {
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
        return null
    })
}