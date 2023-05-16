import React, { useEffect, useRef, useState } from 'react';
import { setInterval } from 'timers/promises';


interface AudioInterface { 
    is_recording: boolean;
    audioBlob: Blob | null;
    audioUrl: string | null;
    startRecording: () => void;
    stopRecording: () => void;

}

function useAudioRecording(): AudioInterface {
    const [is_recording, setRecording] = useState(false);
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
    const [audioUrl, setAudioUrl] = useState<string|null>(null)
    const mediaRecorderRef = useRef<MediaRecorder>();

    const recordingIntervalRef = useRef<number>();
    const [recordingTime, setRecordingTime] = useState<number>(0);

    
    let mediaRecorder: MediaRecorder;
    useEffect(() => {
        return () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        clearInterval(recordingIntervalRef.current);
        };
    }, []);

    const startRecording = (): void => {
        const constraints = { audio: true };
        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          mediaRecorder.addEventListener('dataavailable', handleDataAvailable);
          mediaRecorder.start();
          setRecording(true);
        
        //   recordingIntervalRef.current =  setInterval(() => {
        //     setRecordingTime((recordingTime) => recordingTime + 1);
            
        //     }, 1000);

        });
    };

    const stopRecording = async () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
          mediaRecorderRef.current.stop();
        }
        setRecording(false);
        clearInterval(recordingIntervalRef.current);

        const audioBlob_ = await new Blob(audioChunks, { type: 'audio/wav' });
        setAudioBlob(audioBlob_)


        const url = await URL.createObjectURL(audioBlob_)
        setAudioUrl(url)

    };
    const handleDataAvailable = (event: BlobEvent) => {
        if (event.data.size > 0) {
        setAudioChunks((audioChunks) => [...audioChunks, event.data]);
        }
    };

   return {
        is_recording,
        audioBlob,
        audioUrl,
        startRecording,
        stopRecording,
   }
}

export default useAudioRecording;