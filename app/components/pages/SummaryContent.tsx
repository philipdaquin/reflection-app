import React from 'react'
import AudioPlayer from '../AudioPlayer'
import AudioSynopsys from '../AudioSynopsys'
import BackButton from '../BackButton'
import JournalThumbnail from '../JournalThumbnail'
import SuggestedTags from '../SuggestedTags'
import {CgTranscript} from 'react-icons/cg'


function SummaryContent() {

    let tags = [
        "Pet Loss",
        " Grief",
        "Mourning",
        "Loss",
    ]

    const saveButton = async () => { 
        if (tags.length == 0) return new Error("Emprty Trasncript")
        let formData = new FormData()
        formData.append('transcript', tags.join(","))
        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });
        const data = await response.json();
        console.log("Upload response:", data);
    } 

    return (
        <>
            <div className='flex flex-row items-center justify-between pb-5'>
                <BackButton link='record' />
                <h1 className='font-bold text-[15px] text-center '>Journal Entry Summary</h1>
                <div className='px-4 bg-black'></div>
            </div>

            <div className='flex flex-col items-center space-y-6 pb-7'>
                <JournalThumbnail />
                <h1 className='text-[20px] font-bold text-center'>What's it like to lose a pet</h1>
            </div>

            {/* media player */}
            <AudioPlayer src='https://www.youtube.com/watch?v=cTH824WnA3U' />


            {/* Text summary */}
            <div className='pt-[25px]'>
                <AudioSynopsys />
            </div>

            {/* Suggested Tags */}
            <h1 className="text-lg font-bold">Tags</h1>
            <div className="pt-3">
                <div className="flex flex-wrap ">
                    {tags.map((tag, index) => (
                    <SuggestedTags name={tag} key={tag} />
                    ))}
                </div>
            </div>
            {/* Button to save transcript to notes + summary*/}
            <div onClick={saveButton} className='flex cursor-pointer flex-row items-center space-x-2 pt-5'>
                <CgTranscript size={24} />
                <h1>Save transcript</h1>
            </div>
            {/* Button:
                - Send to Ai 
                - Complete Check in
            */}



        </>


    )
}

export default SummaryContent