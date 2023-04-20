import React, { ChangeEvent, ChangeEventHandler, useEffect, useState } from 'react'
import AudioPlayer from '../AudioPlayer'
import AudioSynopsys from '../AudioSynopsys'
import BackButton from '../BackButton'
import JournalThumbnail from '../JournalThumbnail'
import SuggestedTags from '../SuggestedTags'
import {CgTranscript} from 'react-icons/cg'
import PostSummaryControls from '../PostSummaryControls'
import { useRecoilState } from 'recoil'
import { AudioSummaryAtom } from '../../atoms/atoms'
import {AudioData}  from '../../typings'

interface DownloadProps { 
    transcript : String 
}
function DownloadTranscript({transcript }: DownloadProps) { 
    const [filename, setFilename] = useState('transcript.txt');

    const downloadTranscript = () => {
        const element = document.createElement('a');
        // @ts-ignore
        const file = new Blob([transcript], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };
    
    return (
        <div onClick={downloadTranscript} className='flex cursor-pointer flex-row items-center space-x-2 pt-5'>
            <CgTranscript size={24} />
            <h1>Save transcript</h1>
        </div>
    ) 
}


interface Props { 
    data: AudioData
}

function SummaryContent({data}: Props) {

    const { _id, 
            title, 
            transcription, 
            summary, 
            tags, 
            text_classification, 
            date, 
            day 
          } = data
    const [editedSummary, setEditedSummary] = useState(summary)
    const [editedTags, setEditedTags] = useState(tags)
    const [editedTitle, setEditedTitle] = useState(title)
    

    const [updatedAudioData, setUpdatedAudioData] = useState<AudioData | null>(null)
    useEffect(() => {
        const updatedAudioData = new AudioData(
            _id,
            editedTitle,
            date, 
            day,
            transcription, 
            editedSummary, 
            text_classification, 
            editedTags,
        );
        setUpdatedAudioData(updatedAudioData);
      }, [
        _id,
        editedTitle,
        transcription, 
        editedSummary, 
        text_classification, 
        editedTags, 
        date, 
        day
    ]);
    const [, setAudioDataAtom] = useRecoilState(AudioSummaryAtom);
    
    
    useEffect(() => { 
        if (updatedAudioData) setAudioDataAtom(updatedAudioData)
    }, [updatedAudioData, setAudioDataAtom])

    const handleSummaryChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setEditedSummary(event.target.value);
    }
    const handleTitleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setEditedTitle(event.target.value);
    }

    return (
        <section>
            <div className='flex flex-row items-center justify-between pb-5'>
                <BackButton link='record' />
                <h1 className='font-bold text-[15px] text-center '>Journal Entry Summary</h1>
                <div className='px-4 bg-black'></div>
            </div>
            
            
            <div className='flex flex-col items-center space-y-6 pb-7'>
                <JournalThumbnail />
                <textarea
                    value={editedTitle || ''}
                    onChange={handleTitleChange}
                    style={{height: "40px"}}
                    className='text-[20px] font-bold text-center outline-none w-full bg-gray-100 rounded-2xl '/>

                { !editedTitle  && <div className='text-sm text-red-500 '>
                    Enter Journal Title 
                </div>}
            </div>
            {/* media player */}
            <AudioPlayer src={""} />
            {/* Text summary */}
            <div className='pt-4'>
                <AudioSynopsys 
                    summary={editedSummary} 
                    onChange={handleSummaryChange} 
                    />
            </div>
            {/* Suggested Tags */}
            <h1 className="text-md font-bold pt-5">Tags</h1>
            <div className="pt-3">
                <div className="flex flex-wrap ">
                    {tags?.map((tag, index) => (
                    <SuggestedTags name={tag} key={tag} />
                    ))}
                </div>
            </div>
            {/* Button to save transcript to notes + summary*/}
           { transcription && <DownloadTranscript transcript={transcription}/>}
        </section>
    )
}

export default SummaryContent