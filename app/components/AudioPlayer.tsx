import React, { useCallback, useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player';
import {PlayIcon, StopIcon} from '@heroicons/react/24/solid'
import {EllipsisHorizontalCircleIcon, PauseIcon} from '@heroicons/react/24/outline'
import useAudioPlayer, { PlayerState } from '../hooks/useAudioPlayer';
import { useRecoilState } from 'recoil';
import { AudioPlayerSource, SelectedAudioPlayer } from '../atoms/atoms';
import { DownloadAudio } from './pages/SummaryContent';
import { url } from 'inspector';
import { AudioData } from '../typings';


interface Props { 
    src: string | null,
    title: string | null,
}

function AudioPlayer({src, title} : Props) {

    
    // Set new source to be played, 
    // AudiopLayerState is set to NULL after updated 
    const [, setAudioSource] = useRecoilState(AudioPlayerSource)
    const [source_, setsource] = useState<string>()
    setAudioSource(src)
    const {
      duration, 
      currentTime, 
      formatTime,
      handlePlayClick,
      handleSliderChange,
      isPlaying,
      currentState,
      handleProgress,
      handleEnded,
      source,
      playerRef,
      setCurrent,
      handleDuration,
      handleDisableAutoPlay,
      resetPlayer
    } = useAudioPlayer()

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
            ref={(ref) => (playerRef.current = ref)}
            url={src || ""}
            progressInterval={1000}
            playing={!isPlaying}
            onSeek={setCurrent}
            onProgress={handleProgress}
            onDuration={handleDuration}
            config={{ file: { forceAudio: false } }} // Force the player to use audio
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
            <button onClick={handlePlayClick} className="items-center flex justify-center">
            {
                currentState &&  (currentState === PlayerState.PLAY || currentState === PlayerState.RESUME) ? 
                <PlayIcon height={25} width={25} color="#4285f4" /> : 
                <PauseIcon height={25} width={25} color="#4285f4" strokeWidth={4}/>
            }
            </button>

            <button className='dropdown dropdown-end'>
              <EllipsisHorizontalCircleIcon tabIndex={0} height={24} width={24} color="#4285f4"/>
              
              <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40">
                {
                  src && (
                    <li><DownloadAudio title={title || "Untitled"} url={src}/></li>
                  )
                }
              </ul>
            </button>

          </div>
        </div>
      </>
    );
  };

  export default AudioPlayer