import { PauseIcon, PlayIcon, StopIcon } from '@heroicons/react/20/solid'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { AudioPlayerSource, PlayResumePauseIcons, SelectedAudioPlayer, ShowAudioPlayer } from '../../../atoms/atoms'
import { AudioData, DEFAULT_IMAGE_URL } from '../../../typings'
import { fullTimeFormat } from '../../../util/fullTimeFormat'
import { EllipsisHorizontalCircleIcon } from '@heroicons/react/24/outline'
import { MdOutlineForward10 } from 'react-icons/md'
import ReactPlayer from 'react-player'
import useAudioPlayer, { PlayerState } from '../../../hooks/useAudioPlayer'
import { IconTitle, PlayIconList } from '../../pages/PreviewEntryContent'
import { useRouter } from 'next/router'
import { ThumbnailPlayer } from '../../pages/PlayerContents'
import Image from 'next/image'



interface PlayerProps { 
  audio: AudioData,
}
export function PlayerAttachment({audio: {title, _id, date}}: PlayerProps
  ) { 
    // let date = '2023-05-15T01:25:21.879Z'
    // const title = 'Podcast4 fsdfs dfsdsddsdf'
    let slicedTitle = title?.slice(0, 20) + "..."
    // Opens up the full modal
    const [showPlayer, setshowAudioPlayer] = useRecoilState(ShowAudioPlayer)
    const togglePlayer = () => { 
      setshowAudioPlayer(true)
    }
    const fullDate = fullTimeFormat(date.toString())
    const onHover = "hover:bg-[#EDECEC] active:bg-[#E0E0E0] rounded-full"
    
    const { 
      handlePlayClick,
      handleFastForward,
      currentState,
      currentTime,
      duration
    } = useAudioPlayer() 
    
    return (
      <>
      <div className='mb-5'>
      {/* F5F5F5 */}
        <div className={`hover:bg-[#F5F5F5] border-t-2 border-b-none sm:mb-2
          border-[#F0F0F0] sm:border-none rounded-t-3xl h-full 
          cursor-pointer pb-5 px-5 sm:px-4 flex flex-row pr-4
          justify-between w-full items-center py-4 sm:py-4`}>
          <div  onClick={togglePlayer} className='flex flex-row items-start space-x-2 w-full'>
            <div className='bg-black w-14 h-14 rounded-lg '>
              <Image src={DEFAULT_IMAGE_URL} 
                className='rounded-lg object-fill h-14 w-14' 
                alt='User Profile'  
                height={56}
                width={56}
                quality={100}
            />  
            </div>
            <div className=''>
              <h1 className='font-semibold text-[15px]'>{slicedTitle}</h1>
              <p className='text-[#757575] text-xs'>{fullDate}</p>
            </div>
          </div>
          <div className='flex flex-row space-x-3 sm:space-x-1 z-50'>
            <div className={`${onHover} p-2`} onClick={handlePlayClick} >
              { currentState &&  (currentState === PlayerState.PLAY || currentState === PlayerState.RESUME) ? (
                    <PlayIcon height={24} width={24} color='#000' />
                  ) : (
                    <PauseIcon height={25} width={25} color="#000" strokeWidth={4}/>
                )
              }
            </div>
            <div className={`${onHover} p-2`} onClick={handleFastForward} >
              <MdOutlineForward10 size={24} color="#000"/>    
            </div>
          </div>
        </div>
        <div className=" bg-gray-200  rounded-full h-1 overflow-hidden duration-300 relative">
          <div className=" bg-black h-full" style={{ width: `${(currentTime / duration) * 100}%` }}>
          </div>
        </div>  
        </div>
      </>
      
    )
}


interface Props { 
  children: any,
  selectedAudio: AudioData | null
}

function NavigationMobile({children, selectedAudio} : Props) {
  const router = useRouter()

  // Prevent playing audio + rendering ui on specific links
  const isAudioPlayingPage =
    router.pathname === '/chat' ||
    router.pathname === '/record' ||
    router.pathname === '/mood_summary' ||
    router.pathname.startsWith('/post_analysis/');

  const navContainer = `
    bg-[#FCFCFC] md:px-8 sm:py-5 pb-10  
    shadow-xl sm:drop-shadow-lg drop-shadow-2xl  
    sm:rounded-3xl w-screen border-[#F0F0F0] sm:border-none
    sm:w-full  rounded-b-none
  `

  return (
    <>
      {
        !isAudioPlayingPage  ? (
          <div style={{boxShadow: '0 1px 15px 0 rgba(0, 0, 0, 0.2)'}} className={` ${navContainer} ${selectedAudio ? 'sm:pt-0' : 'py-5'}`}>
            {children}
          </div>
        ) : (
          <div  style={{boxShadow: '0 1px 15px 0 rgba(0, 0, 0, 0.2)'}}  className={` ${navContainer} py-5`}>
            {children}
          </div>
        )
      }
    </>
  )
}

export default NavigationMobile