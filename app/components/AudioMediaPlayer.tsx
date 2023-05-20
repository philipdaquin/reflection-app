import { PlayIcon, StopIcon } from '@heroicons/react/24/solid';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player';
import {MdOutlineForward10 ,  MdOutlineReplay10} from 'react-icons/md'
import { HeartIcon, PauseIcon } from '@heroicons/react/24/outline';
import {BsRepeat, BsRepeat1} from 'react-icons/bs'
import useAudioPlayer, { PlayBackRates, PlayerState } from '../hooks/useAudioPlayer';
import { useRecoilValue } from 'recoil';
import { AudioPlayerSource, PlayResumePauseIcons } from '../atoms/atoms';
import { useRouter } from 'next/router';
import { AudioData } from '../typings';

import { updateEntry } from '../util/audio/updateEntry'
import useAudioData from '../hooks/useAudioData';


interface PlayerProps { 
  source: string;
  isPlaying: boolean; 
  isLoop: boolean;
  duration: number;
  playerRef: MutableRefObject<ReactPlayer | null>;
  setCurrent: (newcurrent: number) => void;
  handleProgress: (state: { played: number; playedSeconds: number }) => void;
  handleDuration: (duration: number) => void;

}

export function Player() {

  const router = useRouter()

  const [src, setSource] = useState<string>()
  const { handleDuration, 
      handleProgress, 
      isLoop, 
      isPlaying, 
      playerRef, 
      setCurrent, 
      source,
      handleEnded,
      playbackRate
    } = useAudioPlayer() 

  useEffect(() => { 
    if (!source) return 
    setSource(source)
  }, [source])

  const isAudioPlayingPage =
    router.pathname === '/chat' ||
    router.pathname === '/record' ||
    router.pathname === '/mood_summary' ||
    router.pathname.startsWith('/post_analysis/');

  return (
    <>
    {
      !isAudioPlayingPage && (

        <ReactPlayer
          ref={(ref) => (playerRef.current = ref)}
          url={src}
          stopOnUnmount={false}
          progressInterval={1000}
          playing={isPlaying}
          onSeek={setCurrent}
          onProgress={handleProgress}
          onDuration={handleDuration}
          loop={isLoop}
          playbackRate={playbackRate} // Adjust the playbackRate as needed
          config={{ file: { forceAudio: true } }} // Force the player to use audio
          style={{ 
          display: "none", 
          width: "100%" 
          }}
          onEnded={handleEnded}
        />
      )
    }
    </>
  )
}

interface FavouriteProps { 
  data: AudioData
}

export function FavouriteButton({data}: FavouriteProps) { 
  const onHover = "hover:bg-[#EDECEC] active:bg-[#E0E0E0] rounded-full p-2"

  const {
    isFavourite,
    handleAddtoFavourites
  } = useAudioData(data)
  return (
    <div className={`cursor-pointer ${onHover}`} 
      onClick={handleAddtoFavourites}>
      <HeartIcon 
        height={25} 
        width={25} 
        color="#424242" 
        strokeWidth={2} 
        fill={`${isFavourite ? '#424242' : '#fff'}`}
      />
    </div>
  )
}


interface AudioProps { 
    data: AudioData | null
}
function AudioMediaPlayer({data}: AudioProps) {
    
    
    const onHover = "hover:bg-[#EDECEC] active:bg-[#E0E0E0] rounded-full p-2"


    const {
      duration, 
      currentTime, 
      formatTime,
      handleFastForward,
      handlePlayClick,
      handlePlayerLoop,
      handleRewindBack,
      handleSliderChange,
      handlePlaybackRate,
      isLoop,
      isPlaying,
      playbackRate,
      currentState
    } = useAudioPlayer()

    return (
        <> 
            <div className='w-full'>
                <input
                    type="range"
                    min={0}
                    max={duration}
                    value={currentTime}
                    onChange={handleSliderChange}
                    className="w-full "
                />
            </div>
            <div className='space-y-2'>
          <div className="flex items-center flex-row justify-between w-full text-[#9e9e9e] text-[9px] text-left font-bold">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>

          </div>

          <div className='flex flex-row items-center justify-between w-full pt-[20px] '>
            
            <div className='w-[46px]'>
               <div className="dropdown dropdown-top">
                  <div tabIndex={0} 
                    className="capitalize rounded-full px-2 py-1 w-fit text-center 
                    text-[25px] cursor-pointer active:scale-90  hover:bg-[#eaeaea]">
                      {playbackRate}x
                  </div>
                  <ul tabIndex={0} 
                    className="dropdown-content menu  shadow-sm drop-shadow-md bg-base-100 rounded-lg mb-2">
                      {
                          PlayBackRates.map((item, i ) => { 
                              return (
                                  <li className='text-xs font-medium capitalize items-center w-full text-center px-2 py-2' 
                                    onClick={() => handlePlaybackRate(item)}>
                                      <a className='active:bg-black text-center'>{PlayBackRates[i]}</a>
                                  </li>
                              )
                          })
                      }
                  </ul>
              </div>
            </div>
            
            <div onClick={handleRewindBack} 
              className={`cursor-pointer ${onHover}`}>
                <MdOutlineReplay10 size={30} color="#424242"/>    
            </div>
            
            
            <button onClick={handlePlayClick} 
              className="items-center flex justify-center bg-[#5d5fef] rounded-full p-[22px] ">
                {
                currentState &&  (currentState === PlayerState.PLAY || currentState === PlayerState.RESUME) ? 
                <PlayIcon height={25} width={25} color="#fff" /> : 
                <PauseIcon height={25} width={25} color="#fff" strokeWidth={4}/>}
            </button>
            
            <div onClick={handleFastForward} 
              className={`cursor-pointer ${onHover}`}>
                <MdOutlineForward10 size={30} color="#424242"/>    
            </div>
            
            <div className={`cursor-pointer ${onHover}`} onClick={handlePlayerLoop}>
              {
                isLoop ? (
                  <BsRepeat1 size={30} color="#424242"/>    
                ) : (
                  <BsRepeat size={30} color="#424242"/>    
                )
              }
            </div>
          </div>
        </div>
        </>
    )
}

export default AudioMediaPlayer