
// Send the WAV fle to the server 
export async function uploadWav(wavFile: Blob): Promise<boolean> {

    const data = new FormData();

    data.append('audio', wavFile, 'recording.wav')

    try { 
        const resp = await fetch('http://localhost:4001/', { 
            method: 'POST',
            body: data
        });

        if (resp.ok) console.log('File uploaded successfully')
        else { console.error('Failed to upload file')}
    } catch(e) { 
        console.error(e)
    }

    return true
}