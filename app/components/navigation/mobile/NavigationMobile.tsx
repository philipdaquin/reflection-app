import { PlayIcon } from '@heroicons/react/20/solid'
import React from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { SelectedAudioPlayer, ShowAudioPlayer } from '../../../atoms/atoms'
import { AudioData } from '../../../typings'
import { fullTimeFormat } from '../../../util/fullTimeFormat'
import { EllipsisHorizontalCircleIcon } from '@heroicons/react/24/outline'
import { MdOutlineForward10 } from 'react-icons/md'


interface PlayerProps { 
  audio: AudioData
}
export function PlayerAttachment(
  {audio: {title, _id, date}}: PlayerProps
  ) { 

    // let date = '2023-05-15T01:25:21.879Z'
    // const title = 'Podcast4 fsdfs dfsdsddsdf'
    let slicedTitle = title?.slice(0, 20) + "..."
    
    const [showPlayer, setshowAudioPlayer] = useRecoilState(ShowAudioPlayer)
    const togglePlayer = () => { 
      setshowAudioPlayer(true)
    }

    const fullDate = fullTimeFormat(date.toString())
    const onHover = "hover:bg-[#EDECEC] active:bg-[#E0E0E0] rounded-full"

    


    return (
      <div className={`hover:bg-[#F5F5F5]
        cursor-pointer rounded-xl pb-5 px-5 sm:px-4 flex flex-row pr-4
        justify-between w-full items-center py-4 sm:py-2 mb-4`}>
        <div  onClick={togglePlayer} className='flex flex-row items-start space-x-2 w-full'>
          <div className='bg-black w-14 h-14 rounded-lg '>
          </div>
          <div className=''>
            <h1 className='font-semibold text-[15px]'>{slicedTitle}</h1>
            <p className='text-[#757575] text-xs'>{fullDate}</p>
          </div>
        </div>
        <div className='flex flex-row space-x-3 sm:space-x-1 z-50'>
          <div className={`${onHover} p-2`}>
            <PlayIcon height={24} width={24} color='#000' />
          </div>
          <div className={`${onHover} p-2`}>
            <MdOutlineForward10 size={24} color="#000"/>    
          </div>
        </div>
      </div>
    )
}


interface Props { 
  children: any
}

function NavigationMobile({children} : Props) {
  const selectedAudio = useRecoilValue(SelectedAudioPlayer)

  return (
    <div className={` bg-white md:px-8  sm:py-3 pb-10  
      shadow-xl sm:drop-shadow-lg drop-shadow-2xl  
      sm:rounded-3xl w-screen 
      sm:w-full ring-4 ring-[#E0E0E0]/20 backdrop-blur-lg  
      rounded-t-3xl rounded-b-none
      ${selectedAudio ? 'py-0 ' : 'py-5'}
      `}>
      {selectedAudio && <PlayerAttachment audio={selectedAudio}/>}
      {/* <PlayerAttachment audio={null}/> */}
      {children}
    </div>
  )
}

export default NavigationMobile