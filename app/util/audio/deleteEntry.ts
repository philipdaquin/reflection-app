import { MAIN_SERVER, UPLOAD_SERVER } from "../../typings"

/*
    Update the Audio file on server
*/
export async function deleteEntry(id: string): Promise<boolean> { 

    return fetch(`${UPLOAD_SERVER}/api/audio/delete-entry`, { 
        method: "DELETE",
        headers: { 
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            _id: id
        })
    }).then(async (resp) => { 
        if (!resp.ok) throw new Error('Unable to update the AudioData')
        return true

    })
    .catch(e => {
        console.error(e)
        return false
    }
    )
}