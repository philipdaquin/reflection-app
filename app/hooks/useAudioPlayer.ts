import { MutableRefObject, useRef, useState } from "react";
import ReactPlayer from "react-player";


interface PlayerInterface { 
    isPlaying: boolean; 
    currentTime: number; 
    isLoop: boolean;
    setCurrent: (newcurrent: number) => void;
    duration: number;
    playerRef: MutableRefObject<ReactPlayer | null>;
    handleProgress: (state: { played: number; playedSeconds: number }) => void;
    handlePlayClick: () => void; 
    handleSliderChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleDuration: (duration: number) => void;
    handleFastForward: () => void;
    handleRewindBack: () => void;
    handlePlayerLoop: () => void;
    formatTime: (time: number) => string
}

export function useAudioPlayer(url: string): PlayerInterface { 
    const audioPlayer = useRef<ReactPlayer | null>(null)
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const [isLoop, setLoop] = useState(false)

    const handlePlayerLoop = () => { 
        setLoop(!isLoop)
    }

    const setCurrent = (newCurrent: number) => { 
        setCurrentTime(newCurrent)
    }

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
      audioPlayer?.current?.seekTo(parseFloat(event.target.value))
    };

    const handleFastForward = () => {
      audioPlayer?.current?.seekTo(audioPlayer?.current?.getCurrentTime() + 10)
    };

    const handleRewindBack = () => {
      audioPlayer?.current?.seekTo(audioPlayer?.current?.getCurrentTime() - 10)
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60)
          .toString()
          .padStart(2, "0");

        return `${minutes}:${seconds}`;
    };

    return  { 
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
    };

}