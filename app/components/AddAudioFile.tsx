import React, { useEffect, useState } from 'react'
import { useRecorder } from 'react-recorder-voice';
import { convertWav } from '../util/convertWav';
import { uploadWav } from '../util/uploadWav';

function AddAudioFile() {
    const [selectedFile, setSelectedFile] = useState(null);
    const {
        // audioURL,
        audioData,
        timer,
        recordingStatus,
        cancelRecording,
        saveRecordedAudio,
        startRecording,

    } = useRecorder();


    const handleFileSelect = (e) => {
        setSelectedFile(e.target.files[0]);
    };
    const [audioSource, setAudioSource] = useState('')
    const handleFormSubmit = (e ) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("audioFile", selectedFile);

        fetch("http://localhost:4001/", {
        method: "POST",
        body: formData,
        })
        .then(async (response) => {
            if (response.ok) {
                const blob = await response.blob()
                // const url = URL.createObjectURL(blob)
                // setAudioSource(url)

                return blob
            } else { 
                throw new Error("Failed to get audio file ")
            }
        })
        .then((data) => {
            const url = URL.createObjectURL(data)
            setAudioSource(url)
        })
        .catch((error) => {
            throw new Error(error)
        });
    };


    // useEffect(() => {
    //     console.log(audioData)
    //     if (audioData == null) return 
    //     convertWav(audioData).then(resp => uploadWav(resp))
    // }, [audioData])

    return (
        <div>
            <form onSubmit={handleFormSubmit}>
                <label htmlFor="audioFile">Select a WAV file:</label>
                    <input
                        type="file"
                        id="audioFile"
                        accept=".wav"
                        onChange={handleFileSelect}
                    />
                <button type="submit">Upload</button>
            </form>
            {
                audioSource && (
                    <audio autoPlay controls>
                        <source src={audioSource} type="audio/mpeg"/>
                    </audio>
                )
            }
        </div>
    )
}

export default AddAudioFile