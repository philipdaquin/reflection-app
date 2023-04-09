
 
/*
    GETS TEXT SUMMARY FROM SERVER
*/
export async function getTextSummary(input: string): Promise<string> { 

    return fetch("http://localhost:4001/api/audio/summary", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            value: input
        })
    })
    .then(async (resp) => { 
        return await resp.text()
    })
    .catch((e) => {
        throw new Error(e)
    })
}