import React, { useState } from 'react'
import { AudioData, DEFAULT_IMAGE_URL } from '../../typings'
import BackButton from '../BackButton'
import { ThumbnailPlayer } from './PlayerContents'
import { useRouter } from 'next/router'
import { PlayIcon } from '@heroicons/react/20/solid'
import { EditButton, LinkButton, MenuItem } from '../AudioEntry'
import { ChevronDownIcon, ChevronRightIcon, EllipsisHorizontalIcon, PlusIcon } from '@heroicons/react/24/outline'
import SuggestedTags from '../SuggestedTags'
import { InsightContainer } from '../moodWidgets/MoodInsightWidget'
import AudioTranscripts from '../AudioTranscripts'



interface Props { 
    entry: AudioData 
}

function PreviewEntryContent({entry: {
  _id,
  title,
  summary,
  date,
  text_classification,
  tags,
  transcription


} }: Props) {
  
  const router = useRouter()

  const emotionEmoji = text_classification.emotion_emoji || "NaN" 
  const moodRating = text_classification.average_mood * 100 
  const currDate = new Date(date.toString())
  const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currDate);
  const day = currDate.getDate()


  const onHover = "hover:bg-[#e0e0e0] active:bg-[#BDBDBD]  "

  const emotionPercent = `${emotionEmoji} ${moodRating.toFixed(1) + "%"}`

  const [toggleTag, settoggleTag] = useState(false)
  const showTags = () => { 
    settoggleTag(!toggleTag)
  }
  const filterTags = toggleTag ? tags : tags?.slice(0,3)

  const [toggleSummary, setToggleSummary] = useState(false)
  const showSummary = () => setToggleSummary(true)
  const filteredSummary = toggleSummary ? summary : summary?.slice(0, 150) + "..." 

  const [toggleTranscript, setToggleTranscript] = useState(false)
  const showTranscript = () => { 
    setToggleTranscript(!toggleTranscript)
  }

  return (
    <section className='flex flex-col h-full'>
      <div className='flex flex-row items-center justify-between pb-5'>
        <BackButton/>
        <h1 className='font-semibold text-[15px] text-center  text-[#757575]'>Preview</h1>
  
        <MenuItem  id={_id} customClass='dropdown-bottom h-[42px] w-[42px] bg-[#212121] items-center flex justify-center'>
          <EllipsisHorizontalIcon height={24} width={24} color='#fff'/>
        </MenuItem>

      </div>
            
      <div className='w-full'>

        <div className=' flex flex-col justify-center items-center space-y-3 '>
          <div className='flex justify-center'>
            <ThumbnailPlayer src={DEFAULT_IMAGE_URL}/>
          </div>
          <div className=' flex flex-col justify-center space-y-1 pt-2'>
            
            <h1 className='font-bold text-[20px]  capitalize text-center '>
              {title}
            </h1>

            <div className=' flex flex-row  justify-beween text-center  space-x-6 text-[16px] text-[#757575]'>
              <p className=' text-black'>
                {emotionPercent}
              </p>
              <p>
                {month} {day}
              </p>
              <p>
                56 mins
              </p>
            </div>

          </div>
          <a onClick={() => router.push(`/play/${_id}`)} href={`/play/${_id}`}
            className={`items-center flex justify-center bg-[#EDECEC] ${onHover} 
              rounded-full px-24 py-3 w-fit space-x-2`}>
              <PlayIcon height={16} width={16} color="#757575" />  
              <h1>Play</h1>
          </a>
        </div>

        <div className=' pt-[25px]'>
          <hr />
        </div>
      </div>

      <div className='pt-[15px] space-y-1'>
        <h1 className='text-left text-xl font-semibold '>
          Summary
        </h1>

        <div>
          <p className='text-sm text-[#757575]'>
            {filteredSummary} <span className='cursor-pointer text-sm text-blue-400 hover:text-blue-300 font-semibold' onClick={showSummary} hidden={toggleSummary}>
              Read more

            </span>
          </p>
        </div>
      </div>
      
      <div className='pt-[5px]'>
          {/* Suggested Tags */}
          {/* <h1 className="text-md font-semibold pt-5">Tags</h1> */}
            <div className="pt-3 flex ">
                <div className="flex flex-wrap">
                    {filterTags?.map((tag, index) => (
                      <SuggestedTags  key={tag}>
                        {tag}
                      </SuggestedTags>
                    ))}
                </div>
                <div onClick={showTags} hidden={toggleTag}>
                  <SuggestedTags  >
                    <EllipsisHorizontalIcon height={20} width={20} strokeWidth={2} />        
                  </SuggestedTags>
                </div>
            </div>
      </div>
      
      <div>
        <h1 className="text-md font-semibold pt-5">Insights</h1>

         <div className='flex space-x-4 pt-3'>
            <InsightContainer date={`${text_classification.emotion}`} title='Overall Emotion'/>
            <InsightContainer date={`${emotionPercent}`} title='Mood Rating'/>
          </div>
      </div>
      
      <div className='pt-5 w-full '>
        <div onClick={showTranscript} className='w-full flex flex-row items-center justify-between cursor-pointer  py-2 rounded-lg'>
          <h1 className="text-md font-semibold">Audio Transcript</h1>
          {
            toggleTranscript ? (
              <ChevronDownIcon height={24} width={24} color='#000' />
            ) : (
              <ChevronRightIcon height={24} width={24} color='#000' />
            )
          }

        </div>
      </div>
       { toggleTranscript && (
          <div>
            {/* <h1 className="text-md text-center font-semibold pt-5">Transcription</h1> */}
            <hr className='mt-4 pb-2' />
            <p className='text-sm text-[#757575] pt-4'>
              <AudioTranscripts text={transcription}/>
            
            </p>
          </div>

        )
      }      

        <div className='pb-52'></div>
      
    </section>

  )
}

export default PreviewEntryContent