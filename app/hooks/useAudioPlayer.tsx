import React, { MutableRefObject, useContext, createContext,
    useEffect, useMemo, useRef, useState, Children, useCallback } from "react";
import ReactPlayer from "react-player";
import { AudioPlayerSource } from "../atoms/atoms";
import { useRecoilValue } from "recoil";

export enum PlayerState { 
  PLAY = 'play',
  PAUSE = 'pause', 
  RESUME = 'resume'
}

interface PlayerInterface { 
    source: string | null, 
    isPlaying: boolean; 
    currentTime: number; 
    isLoop: boolean;
    duration: number;
    isEnded: boolean;
    currentState: PlayerState | null;
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
    currentState: null, 
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



    const [currentState, setCurrentState] = useState<PlayerState | null>(PlayerState.PLAY)
    const [isStarted, setIsStarted] = useState(false)
    // 
    useEffect(() => {
      if (currentTime === 0 && !isStarted) {
        setCurrentState(PlayerState.PLAY); // Show "Play" when not started
      }else if (isEnded) {
        // If the audio has ended, reset all states
        setCurrentState(PlayerState.PLAY); // Show "Play" when current time equals duration

      } else if (isPlaying) {

        setCurrentState(PlayerState.PAUSE); // Show "Pause" when currently playing
      } else if (currentTime > 0 && !isPlaying) {

        setCurrentState(PlayerState.RESUME); // Show "Resume" when current time > 0 and not playing
      } 
    }, [isPlaying, isStarted, currentTime, duration, isEnded]);

    const handleEnded = useCallback(() =>{
      setIsEnded(true)
      setCurrentTime(0)
      setIsStarted(false)
    }, [])

    console.log(duration, currentTime, isEnded)

    const handlePlayerLoop = useCallback(() => { 
      setLoop((prevIsLoop) => !prevIsLoop);
    }, [])

    const setCurrent = useCallback((newCurrent: number) => { 
        setCurrentTime(newCurrent)
    }, [])

    const handlePlayClick = () => {
      setIsPlaying(!isPlaying);
      setIsStarted(true)
    };
    const handleProgress = useCallback((state: { played: number; playedSeconds: number }) => {
      
      if (isEnded) {
        setCurrentTime(0)
      } else { 
        setCurrentTime(state.playedSeconds);
      }

    }, [isEnded]);

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
      isEnded,
      currentState
    }), [
      isPlaying, currentTime, setCurrentTime, isLoop, duration, 
      audioPlayer, handleProgress, handlePlayClick, handleSliderChange, 
      handleDuration, handlePlayerLoop, handleFastForward, 
      handleRewindBack, formatTime, source, handleEnded, isEnded, currentState
    ]
    )

  
    return <AudioContext.Provider value={memoValue}>
      {children}
    </AudioContext.Provider>
  
}

export default function useAudioPlayer() { 
  return useContext(AudioContext)
}