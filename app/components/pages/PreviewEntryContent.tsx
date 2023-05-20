import React, { useEffect, useState } from 'react'
import { AudioData, DEFAULT_IMAGE_URL } from '../../typings'
import BackButton from '../BackButton'
import { ThumbnailPlayer } from './PlayerContents'
import { useRouter } from 'next/router'
import { PauseIcon, PlayIcon, StopIcon } from '@heroicons/react/20/solid'
import { EditButton, LinkButton, MenuItem } from '../AudioEntry'
import { ChevronDownIcon, ChevronRightIcon, EllipsisHorizontalIcon, PlusIcon } from '@heroicons/react/24/outline'
import SuggestedTags from '../SuggestedTags'
import { InsightContainer } from '../moodWidgets/MoodInsightWidget'
import AudioTranscripts from '../AudioTranscripts'
import { AudioPlayerSource, PlayResumePauseIcons, SelectedAudioPlayer } from '../../atoms/atoms'
import { useRecoilState } from 'recoil'
import useAudioPlayer, { PlayerState } from '../../hooks/useAudioPlayer'


export const PlayIconList = [
  {
    title: 'Resume', 
    icon: <PlayIcon height={16} width={16} color="#757575" />  
  },
  {
    title: 'Pause', 
    icon: <PauseIcon height={16} width={16} color="#757575" />  
  },
  {
    title: 'Play', 
    icon: <PlayIcon height={16} width={16} color="#757575" />  
  },
]

interface Props { 
    entry: AudioData 
}

export type IconTitle = { 
  title: string, 
  icon: any
}

function PreviewEntryContent({entry}: Props) {
  
  const { _id, title, summary, date, 
      text_classification, tags, 
      transcription, 
      description,
      favourite,
      duration,
      author,
      audio_url,
      image_url,
      
  } = entry 

  const router = useRouter()

  const emotionEmoji = text_classification?.emotion_emoji || "NaN" 
  const emotion= text_classification?.emotion || "NaN" 

  const moodRating = text_classification?.average_mood || 0 * 100 
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
  const [selectedData, setSelectedData] = useRecoilState(SelectedAudioPlayer)
  const [source, setAudioSource] = useRecoilState(AudioPlayerSource)
  const [toggleTranscript, setToggleTranscript] = useState(false)
  const src ="https://www.youtube.com/watch?v=wsCJB8TW2Ck"


  const { 
    handlePlayClick,
    currentState
  } = useAudioPlayer() 

  const togglePlay = () => { 
    handlePlayClick()
    setSelectedData(entry)
    setAudioSource(src)
    // router.push(`/play/${_id}`)
  }

  const showTranscript = () => { 
    setToggleTranscript(!toggleTranscript)
  }


  return (
    <section className='flex flex-col h-full w-full'>
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

            <div className=' flex flex-row  justify-center text-center  space-x-3 text-[14px] text-[#757575]'>
            <p className=''>
                {emotion}
            </p>
            <p>
                •
            </p>
            <p>
                {month} {day}
            </p>
            <p>
                •
            </p>
            <p>
                56 mins
            </p>
            </div>

          </div>
          <button onClick={togglePlay} 
            className={`cursor-pointer items-center text-[#757575] 
              text-sm font-regular -px-10
              flex justify-center bg-[#EDECEC] ${onHover} 
              rounded-full  py-4 w-full space-x-2`}>
                {currentState &&  (currentState === PlayerState.PLAY || currentState === PlayerState.RESUME) ? (
                      <PlayIcon height={16} width={16} color='#757575' />
                    ) : (
                      <PauseIcon height={16} width={16} color="#757575" strokeWidth={4}/>
                  )
                }
                <h1 className='capitalize'>
                  {currentState?.toString()}
                </h1>
          </button>
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
                      
      <div className='space-y-3 pt-4'>
        <h1 className="text-md font-semibold">Insights</h1>

         <div className='flex space-x-4'>
            <InsightContainer date={`${text_classification?.emotion}`} title='Overall Emotion'/>
            <InsightContainer date={`${emotionPercent}`} title='Mood Rating'/>
          </div>
      </div>

                      
      <div className='pt-[15px] space-y-1'>
        <h1 className='text-left text-xl font-semibold '>
          Notes 
        </h1>

        <div>
          <p className='text-sm text-[#757575]'>
            {description}
          </p>
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

        <div className='pb-52'></div>
      
    </section>

  )
}

export default PreviewEntryContent