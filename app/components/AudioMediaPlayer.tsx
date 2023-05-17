import { PlayIcon, StopIcon } from '@heroicons/react/24/solid';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player';
import {MdOutlineForward10 ,  MdOutlineReplay10} from 'react-icons/md'
import { HeartIcon, PauseIcon } from '@heroicons/react/24/outline';
import {BsRepeat, BsRepeat1} from 'react-icons/bs'
import useAudioPlayer from '../hooks/useAudioPlayer';
import { useRecoilValue } from 'recoil';
import { AudioPlayerSource } from '../atoms/atoms';



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
  const [src, setSource] = useState<string>()
  const { handleDuration, 
      handleProgress, 
      isLoop, 
      isPlaying, 
      playerRef, 
      setCurrent, 
      source
    } = useAudioPlayer() 

  useEffect(() => { 
    if (!source) return 
    setSource(source)
  }, [source])

  return (
    <>
      <ReactPlayer
        ref={(ref) => (playerRef.current = ref)}
        url={src}
        playing={isPlaying}
        onSeek={setCurrent}
        onProgress={handleProgress}
        onDuration={handleDuration}
        loop={isLoop}
        style={{ 
        display: "none", 
        width: "100%" 
        }}
      />
    </>
  )
}


interface AudioProps { 
    isPlaying: boolean; 
    currentTime: number; 
    isLoop: boolean;
    duration: number;
    playerRef: MutableRefObject<ReactPlayer | null>;
    setCurrent: (newcurrent: number) => void;
    handleProgress: (state: { played: number; playedSeconds: number }) => void;
    handlePlayClick: () => void; 
    handleSliderChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleDuration: (duration: number) => void;
    handleFastForward: () => void;
    handleRewindBack: () => void;
    handlePlayerLoop: () => void;
    formatTime: (time: number) => string
}
function AudioMediaPlayer() {
    
    
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
      isLoop,
      isPlaying,
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
            
            <div className={`cursor-pointer ${onHover}`}>
              <HeartIcon height={25} width={25} color="#424242" strokeWidth={2} />
            </div>
            
            <div onClick={handleRewindBack} 
              className={`cursor-pointer ${onHover}`}>
                <MdOutlineReplay10 size={30} color="#424242"/>    
            </div>
            
            
            <button onClick={handlePlayClick} 
              className="items-center flex justify-center bg-[#5d5fef] rounded-full p-[22px] ">
                {!isPlaying ? 
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