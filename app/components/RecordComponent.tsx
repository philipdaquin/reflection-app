import React, { useState } from 'react'
import { useRecorder } from "react-recorder-voice";

function RecordComponent() {
    const {
        audioURL,
        audioData,
        timer,
        recordingStatus,
        cancelRecording,
        saveRecordedAudio,
        startRecording,
    } = useRecorder();


    const [recording, isRecording] = useState(false)

    return (
        <div>
            <button onClick={startRecording}>Start</button>
            <button onClick={cancelRecording}>Cancel</button>
            <button onClick={saveRecordedAudio}>Stop and Save</button>
            <audio controls src={audioURL}></audio>
            <h1>{timer}</h1>
        </div>
    );
}

export default RecordComponent