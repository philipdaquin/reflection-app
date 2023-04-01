import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import { convertWav } from '../util/convertWav';
import { getRelatedTags } from '../util/getRelatedTags';
import { getTextSummary } from '../util/getTextSummary';
import { uploadWav } from '../util/uploadWav';

function AddAudioFile() {
    const [selectedFile, setSelectedFile] = useState(null);
    const router = useRouter()
    const handleFileSelect = (e: any) => {
        setSelectedFile(e.target.files[0]);
    };
    const [audioSource, setAudioSource] = useState('')

    const [transcription, setTranscription] = useState('')
    const [summary, setSummary] = useState<string>('')
    const [relatedTags, setRelatedTags] = useState<string[] | null>(null)

    // const transcription = "I can feel the weight of everything you're carrying right now. Losing your mother and feeling stuck in a job you hate can make it feel like life is just piling on the struggles. I want you to know that it's okay to feel overwhelmed and uncertain. These are incredibly challenging circumstances to navigate. It might be helpful to take some time to reflect on what you truly want out of life, and what[3000 - 6000]:  make progress towards that. Remember, you're not alone. There are people who care about you and want to support you through this difficult time. You deserve to find happiness and fulfillment, even in the midst of all this pain. Don't give up on yourself, and don't hesitate to reach out for help when you need it. I'm here for you, my friend."
    const handleFormSubmit = (e: any) => {
        e.preventDefault();
        const formData = new FormData();

        formData.append("audio", selectedFile!);

        fetch("http://localhost:4001/api/openai-chat", {
            method: "POST",
            body: formData,
        })
        .then(async (response) => {
            // if (response.ok) {
            //     const transcript = await response.text()    
            //     return transcript
            // } else { 
            //     throw new Error("Failed to get audio file ")
            // }
            if (response.ok) {
                const blob = await response.blob()
                const url = URL.createObjectURL(blob)
                console.log(url)
                // setAudioURL(url)
                // setAudioUrl(url)
                setAudioSource(url)
          } else { 
            throw new Error("Failed to get audio file")
          }
        })
        // .then(async (data) => {
        //     setTranscription(data)

        //     const summary = await getTextSummary(data);
        //     setSummary(summary)
            
        //     const tags = await getRelatedTags(transcription);
        //     setRelatedTags(tags)
            
        //     const pageData = {
        //         transcript: transcription,
        //         orginalAudio: selectedFile,
        //         summary: summary,
        //         tags: tags
        //     }

        //     router.push({
        //         pathname: '/post_analysis',
        //         query: {
        //             data: JSON.stringify(pageData)
        //         }
        //     })
        //     // const shortSummary = await getTextSummary(transcription)
        //     // setSummary(shortSummary)
        //     // console.log(shortSummary)
        // })
       
        .catch((error) => {
            throw new Error(error)
        });
    };

    // const getTags = async () => { 
    //     const as = await getRelatedTags(transcription)
    //     setRelatedTags(as)
    // }

    // useEffect(() => { 
    //     if (transcription == null) return   
    //     getTags()

    // }, [transcription])

    // useEffect(() => {
    //     console.log(audioData)
    //     if (audioData == null) return 
    //     convertWav(audioData).then(resp => uploadWav(resp))
    // }, [audioData])

    return (
        <div>
            <form onSubmit={handleFormSubmit}>
                <label htmlFor="audioFile">Select a WAV file:</label>
                    <input
                        type="file"
                        id="audioFile"
                        accept=".wav"
                        onChange={handleFileSelect}
                    />
                <button type="submit">Upload</button>

                <div className='text-sm text-center flex-col justify-center space-y-4'>
                    <h1>
                        Transcript:
                    </h1>
                    <h1>
                        {transcription}
                    </h1>
                    <h1  className="cursor-pointer font-bold text-lg">
                        Summary
                    </h1>
                    <h1>
                        {summary}
                    </h1>
                    <h1  className="cursor-pointer font-bold text-lg">
                        Related Tags
                    </h1>
                    <h1 className='space-x-2 capitalize'>
                        {relatedTags?.map((e) => {
                            return (
                                <div className='text-sm font-semibold '>{e}</div>
                            )
                        })}
                    </h1>

                </div>

            </form>
            {
                audioSource && (
                    <audio controls  autoPlay src={audioSource}></audio>

                )
            }
        </div>
    )
}

export default AddAudioFile