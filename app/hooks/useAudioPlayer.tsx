import React, { MutableRefObject, useContext, createContext,
    useEffect, useMemo, useRef, useState, Children, useCallback } from "react";
import ReactPlayer from "react-player";
import { useRecoilState, useRecoilValue } from "recoil";
import { AudioPlayerSource } from "../atoms/atoms";


interface PlayerInterface { 
    source: string | null, 
    isPlaying: boolean; 
    currentTime: number; 
    isLoop: boolean;
    duration: number;
    isEnded: boolean;
    playerRef: MutableRefObject<ReactPlayer | null>;
    setCurrent: (newcurrent: number) => void;
    handleProgress: (state: { played: number; playedSeconds: number }) => void;
    handlePlayClick: () => void; 
    handleEnded: () => void; 
    handleSliderChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleDuration: (duration: number) => void;
    handleFastForward: () => void;
    handleRewindBack: () => void;
    handlePlayerLoop: () => void;
    formatTime: (time: number) => string
}
  
const AudioContext = createContext<PlayerInterface>({
    source: null, 
    isPlaying: false, 
    currentTime: 0,
    isLoop: false,
    duration: 0,
    isEnded: false,
    playerRef: { current: null},
    setCurrent: () => {},
    handleProgress: () => {},
    handlePlayClick: () => {},
    handleEnded: () => {},
    
    handleSliderChange: () => {},
    handleDuration: () => {},
    handleFastForward: () => {},
    handleRewindBack: () => {},
    handlePlayerLoop: () => {},
    formatTime: () => ""
}) 

interface Props { 
  children: React.ReactNode
}

export const AudioProvider = ({ children} : Props) => { 
    const audioPlayer = useRef<ReactPlayer | null>(null)
    const [isPlaying, setIsPlaying] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const [isEnded, setIsEnded] = useState(false)

    const [isLoop, setLoop] = useState(false)

    const handleEnded = () => setIsEnded(true)

    const handlePlayerLoop = useCallback(() => { 
      setLoop((prevIsLoop) => !prevIsLoop);
    }, [])

    const setCurrent = useCallback((newCurrent: number) => { 
        setCurrentTime(newCurrent)
    }, [])

    const handlePlayClick = () => {
      setIsPlaying(!isPlaying);
    };
    const handleProgress = useCallback((state: { played: number; playedSeconds: number }) => {
      setCurrentTime(state.playedSeconds);
    }, []);

    const handleDuration = useCallback((duration: number) => {
      setDuration(duration);
    }, []);
    
    const handleSliderChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
      audioPlayer?.current?.seekTo(parseFloat(event.target.value))
    }, []);

    const handleFastForward = useCallback(() => {
      audioPlayer?.current?.seekTo(audioPlayer?.current?.getCurrentTime() + 10)
    }, []);

    const handleRewindBack = useCallback(() => {
      audioPlayer?.current?.seekTo(audioPlayer?.current?.getCurrentTime() - 10)
    }, []);

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60)
          .toString()
          .padStart(2, "0");

        return `${minutes}:${seconds}`;
    };

    const source = useRecoilValue(AudioPlayerSource)
    const memoValue = useMemo(() => ({ 
      isPlaying,
      currentTime,
      setCurrent,
      isLoop,
      duration,
      playerRef: audioPlayer,
      handleProgress,
      handlePlayClick,
      handleSliderChange,
      handleDuration,
      handlePlayerLoop,
      handleFastForward,
      handleRewindBack,
      formatTime,
      source,
      handleEnded,
      isEnded
    }), [
      isPlaying, currentTime, setCurrentTime, isLoop, duration, 
      audioPlayer, handleProgress, handlePlayClick, handleSliderChange, 
      handleDuration, handlePlayerLoop, handleFastForward, 
      handleRewindBack, formatTime, source, handleEnded, isEnded
    ]
    )

  
    return <AudioContext.Provider value={memoValue}>
      {children}
    </AudioContext.Provider>
  
}

export default function useAudioPlayer() { 
  return useContext(AudioContext)
}