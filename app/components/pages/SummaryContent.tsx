import React, { ChangeEvent, ChangeEventHandler, useEffect, useState } from 'react'
import AudioPlayer from '../AudioPlayer'
import BackButton from '../BackButton'
import JournalThumbnail from '../JournalThumbnail'
import SuggestedTags from '../SuggestedTags'
import {CgTranscript} from 'react-icons/cg'
import PostSummaryControls from '../PostSummaryControls'
import { useRecoilState } from 'recoil'
import { AudioSummaryAtom } from '../../atoms/atoms'
import {AudioData, AudioDataBuilder}  from '../../typings'
import AudioDescription from '../AudioDescription'
import AudioTranscripts from '../AudioTranscripts'
import {ChevronDownIcon, ChevronRightIcon, CloudArrowDownIcon, PlusIcon, XMarkIcon} from '@heroicons/react/24/outline'
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
interface DownloadAudioProps { 
    url : string,
    title: string, 
}
export function DownloadAudio({url, title}: DownloadAudioProps) { 

    const handleDownload = async () => {
        try {
          const response = await fetch(url);
          const blob = await response.blob();
    
          // Create a download link
          const downloadLink = document.createElement('a');
          downloadLink.href = URL.createObjectURL(blob);
          downloadLink.download = title;
          downloadLink.click();
        } catch (error) {
          console.error('Error downloading audio:', error);
        }
      };
    
    
    return (
        <div onClick={handleDownload} 
            className='cursor-pointer text-xs flex justify-center 
              flex-row items-center space-x-2'>
            <CloudArrowDownIcon height={24} width={24} color='#757575' />
            <h1>Download Audio</h1>
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
            day, 
            author, 
            description,
            duration, 
            favourite, 
            image_url,
            audio_url
          } = data
    const [editedSummary, setEditedSummary] = useState(summary)
    const [editedTags, setEditedTags] = useState(tags)
    const [editedTitle, setEditedTitle] = useState(title)
    const [editedDescription, setEditedDescription] = useState(description)
    

    const [updatedAudioData, setUpdatedAudioData] = useState<AudioData | null>(null)
    useEffect(() => {
        const builder = new AudioDataBuilder(_id, date)
        .setTranscript(transcription)
        .setTitle(editedTitle)
        .setImageUrl(image_url)
        .setAudioUrl(audio_url)
        .setAuthor(author)
        .setDescription(editedDescription)
        .setDuration(duration)
        .setFavourite(favourite)
        .setDay(day)
        .setSummary(editedSummary)
        .setTextClassification(text_classification)
        .setTags(editedTags)
        .build()
        setUpdatedAudioData(builder);
      }, [
        _id,
        editedTitle,
        transcription, 
        editedSummary, 
        editedDescription,
        text_classification, 
        editedTags, 
        date, 
        day,
        author, 
        duration, 
        favourite, 
        image_url,
        audio_url
    ]);
    const [, setAudioDataAtom] = useRecoilState(AudioSummaryAtom);
    
    const [toggleTag, settoggleTag] = useState(false)
    const handleToggleSummary = () => settoggleTag(!toggleTag)
    
    const [showSummary, setShowSummary] = useState(false)
    const filteredSummary = showSummary ? summary : summary?.length || 0 > 150 ? summary?.slice(0, 150) + "..." : summary
    const handleShowSummary = () => setShowSummary(!showSummary)

    useEffect(() => { 
        if (updatedAudioData) setAudioDataAtom(updatedAudioData)
    }, [updatedAudioData, setAudioDataAtom])

    const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setEditedDescription(event.target.value);
    }
    const handleTitleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setEditedTitle(event.target.value);
    }
    const [toggleTranscript, setToggleTranscript] = useState(false)


    const srch ="https://www.youtube.com/watch?v=wsCJB8TW2Ck"
    const showTranscript = () => { 
        setToggleTranscript(!toggleTranscript)
      }

    const [newTag, setNewTag] = useState('');
    const [isAddingTag, setIsAddingTag] = useState(false);

    const handleTagRemove = (tag: string) => {
        setEditedTags((prevTags) => editedTags?.filter((t) => t !== tag) || []);
    };
    const handleAddTag = () => {
        if (newTag.trim() !== '') {
        setEditedTags((prevTags) => [...prevTags || [], newTag]);
          setNewTag('');
          setIsAddingTag(false);
        }
      };
    const handleInputKeyPress = (event: any) => {
      if (event.key === 'Enter') {
        handleAddTag();
      }
    };

    const [selectedTag, setselectedTag] = useState('')
    
    return (
        <section className='pb-52'>
            <div className='flex flex-row items-center justify-between pb-5'>
                <BackButton />
                <h1 className='font-bold text-[15px] text-center '>Journal Entry Summary</h1>
                <div className='px-4 bg-black'></div>
            </div>
            
            
            <div className='flex flex-col items-center space-y-6 pb-6'>
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
            <AudioPlayer 
                // src={audio_url} 
                src={srch} 
                title={editedTitle}
            />

            <div className='pt-7'>
                <hr />
            </div>

            <div className='flex flex-col w-full pt-4'>
                <div className='text-left space-y-1'>
                    <h1 className='text-md font-bold'>Audio Summary</h1>
                    {/* <textarea className='text-[#424242] border-2 rounded-2xl bg-gray-100 p-2 w-full h-full text-[13px] outline-none' 
                    style={{ minHeight: '100px' }} 
                    value={summary || ''}
                    /> */}
                    <p className='text-sm text-[#757575]'>
                        {filteredSummary} <span className='cursor-pointer text-sm text-blue-400 hover:text-blue-300 font-semibold' 
                        onClick={handleShowSummary} 
                        hidden={showSummary}>
                        Read more

                        </span>
                    </p>
                </div>
            </div>

            {/* Text summary */}
            <div className='pt-4'>
                <AudioDescription 
                    description={editedDescription} 
                    onChange={handleDescriptionChange} 
                    />
            </div>
            {/* Suggested Tags */}
            <h1 className="text-md font-bold pt-5">Tags</h1>
            {/* <div className="pt-3">
                <div className="flex flex-wrap items-center">
                    {tags?.map((tag, index) => (
                        <div className='relative'>

                            <div className='absolute p-2 bg-red-500 right-0 top-0 rounded-full'>
                            </div>

                            <SuggestedTags  key={tag}>
                                {tag}
                            </SuggestedTags>
                        </div>
                    ))}
                    <div>
                        <SuggestedTags>
                            <PlusIcon height={20} width={20}  color='#4285f4'/>
                        </SuggestedTags>
                    </div>
                </div>
            </div> */}
            <div className="pt-3">
                <div className="flex flex-wrap items-center">
                    {editedTags?.map((tag, index) => (
                    <div className="relative  duration-500 " key={tag} 
                        onMouseEnter={() => setselectedTag(tag)} 
                        onMouseLeave={() => setselectedTag('')}
                    >
                        
                        <div onClick={() => handleTagRemove(tag)}
                            className={`absolute  right-0 bottom-5
                                ${selectedTag === tag ? 
                                    `h-5 w-5 bg-[#FAD9D9] rounded-full cursor-pointer hover:bg-[#f09d9d]`
                                    : 'hidden'
                                }
                                flex flex-row justify-center items-center`}>
                            <XMarkIcon height={16} width={16} color='#e84040' strokeWidth={2}/>
                        </div>
                        <SuggestedTags>
                            {tag}
                        </SuggestedTags>

                    </div>
                    ))}
                    <div onClick={() => setIsAddingTag(!isAddingTag)}>
                        <SuggestedTags>
                          <PlusIcon height={20} width={20} color="#4285f4" strokeWidth={2}/>
                        </SuggestedTags>
                    </div>
                    {isAddingTag && (
                    <div className='border-[#E0E0E0] border-2 rounded-lg'>
                        <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onBlur={handleAddTag}
                            onKeyUp={handleInputKeyPress}
                            className='outline-none bg-[#FCFCFC]  rounded-lg text-xs text-[#757575] px-2 items-center'
                        />
                    </div>
                    ) }
                </div>
            </div>

            {/* Button to save transcript to notes + summary*/}
           {/* { transcription && <DownloadTranscript transcript={transcription}/>} */}
           <div className='pt-5 w-full '>
                <div onClick={showTranscript} className='w-full flex flex-row items-center justify-between cursor-pointer  py-2 rounded-lg'>
                <h1 className="text-md font-semibold">Show Audio Transcript</h1>
                {
                    toggleTranscript ? (
                    <ChevronDownIcon height={24} width={24} color='#000' />
                    ) : (
                    <ChevronRightIcon height={24} width={24} color='#000' />
                    )
                }

                </div>
            </div>
            <div className='' onClick={handleToggleSummary}>
            { toggleTranscript && transcription &&  (
                    <div>
                        {/* <h1 className="text-md text-center font-semibold pt-5">Transcription</h1> */}
                        <hr className='mt-4 pb-2' />
                        <p className='text-sm text-[#757575] pt-4'>
                        <AudioTranscripts text={transcription}/>
                        
                        </p>
                    </div>
                    )
                }      
           </div>

            <div className='pb-52'></div>
        </section>
    )
}

export default SummaryContent