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
    
    const onHover = "hover:bg-[#f5f5f5] active:bg-[#E0E0E0] "

    return (
      <div onClick={togglePlayer} className={`${onHover} cursor-pointer rounded-xl px-2 flex flex-row justify-between w-full items-center py-2 mb-4`}>
        <div className='flex flex-row items-start space-x-2 w-full'>
          <div className='bg-black w-14 h-14 rounded-lg '>
          </div>
          <div className=''>
            <h1 className='font-semibold text-[15px]'>{slicedTitle}</h1>
            <p className='text-[#757575] text-xs'>{fullDate}</p>
          </div>
        </div>
        <div className='flex flex-row space-x-1 '>
          <PlayIcon height={24} width={24} color='#000' />
          <MdOutlineForward10 size={24} color="#000"/>    
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
    <div className=' bg-white md:px-8 px-2 sm:py-3 py-5 pb-10  shadow-xl sm:drop-shadow-lg drop-shadow-2xl 
      sm:rounded-3xl w-screen sm:w-full ring-4  ring-[#E0E0E0]/20 backdrop-blur-lg  rounded-t-3xl rounded-b-none '>
      {selectedAudio && <PlayerAttachment audio={selectedAudio}/>}
      {/* <PlayerAttachment audio={null}/> */}
      {children}
    </div>
  )
}

export default NavigationMobile