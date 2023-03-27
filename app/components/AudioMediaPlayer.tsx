import { PlayIcon, StopIcon } from '@heroicons/react/24/solid';
import React, { useState } from 'react'
import ReactPlayer from 'react-player';
import {MdOutlineForward10 ,  MdOutlineReplay10} from 'react-icons/md'
import { HeartIcon } from '@heroicons/react/24/outline';
import {BsRepeat1} from 'react-icons/bs'


interface Props { 
    src: string

}
function AudioMediaPlayer({src}: Props) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
  
    const handlePlayClick = () => {
      setIsPlaying(!isPlaying);
    };
  
    const handleProgress = (state: { played: number; playedSeconds: number }) => {
      setCurrentTime(state.playedSeconds);
    };
  
    const handleDuration = (duration: number) => {
      setDuration(duration);
    };
  
    const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      setCurrentTime(parseFloat(event.target.value));
    };

    const handleFastForward = () => {
        setCurrentTime(currentTime + 10);
    };

    const handleRewindBack = () => {
      setCurrentTime(currentTime - 10);
    };
    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60)
        .toString()
        .padStart(2, "0");
      return `${minutes}:${seconds}`;
    };
    
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
                <ReactPlayer
                    url={src}
                    playing={isPlaying}
                    onSeek={setCurrentTime}
                    onProgress={handleProgress}
                    onDuration={handleDuration}
                    style={{ 
                    display: "none", 
                    width: "100%" 
                    }}
                />
            </div>
            <div className='space-y-2'>
          <div className="flex items-center flex-row justify-between w-full text-[#9e9e9e] text-[9px] text-left font-bold">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>

          <div className='flex flex-row items-center justify-between w-full pt-[20px] '>

            <HeartIcon height={25} width={25} color="#424242" strokeWidth={2} />
            
            <div onClick={() => handleRewindBack} className={"cursor-pointer"}>
                <MdOutlineReplay10 size={30} color="#424242"/>    
            </div>
            
            
            <button onClick={handlePlayClick} className="items-center flex justify-center bg-[#5d5fef] rounded-full p-[22px] ">
                {!isPlaying ? 
                <PlayIcon height={25} width={25} color="#fff" /> : 
                <StopIcon height={25} width={25} color="#fff"/>}
            </button>
            
            <div onClick={() => handleFastForward} className={"cursor-pointer"}>
                <MdOutlineForward10 size={30} color="#424242"/>    
            </div>
            
            <BsRepeat1 size={30} color="#424242"/>    
          </div>
        </div>
        </>
    )
}

export default AudioMediaPlayer