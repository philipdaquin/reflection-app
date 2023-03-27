import React, { useState } from 'react'
import ReactPlayer from 'react-player';
import {PlayIcon, StopIcon} from '@heroicons/react/24/solid'
import {EllipsisHorizontalCircleIcon} from '@heroicons/react/24/outline'


interface Props { 
    src: string
}

function AudioPlayer({src} : Props) {
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
  
    const formatTime = (time: number) => {
      const minutes = Math.floor(time / 60);
      const seconds = Math.floor(time % 60)
        .toString()
        .padStart(2, "0");
      return `${minutes}:${seconds}`;
    };
  
    return (
      <>  
        <div className='w-full flex'>
          <input
              type="range"
              min={0}
              max={duration}
              value={currentTime}
              onChange={handleSliderChange}
              className="w-full"
          />
         <ReactPlayer
            url={src}
            playing={isPlaying}
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

          <div className='flex items-center flex-row justify-between w-full'>
            <button onClick={handlePlayClick} className="items-center flex justify-center">{

              !isPlaying ? <PlayIcon height={24} width={24} color="#4285f4"/> : <StopIcon height={24} width={24} color="#4285f4"/>

            }</button>

            <button>
              <EllipsisHorizontalCircleIcon  height={24} width={24} color="#4285f4"/>
            </button>

          </div>
        </div>
      </>
    );
  };

  export default AudioPlayer