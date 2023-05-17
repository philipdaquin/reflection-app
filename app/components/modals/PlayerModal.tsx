import React, { MutableRefObject } from 'react'
import PreviewEntryContent from '../pages/PreviewEntryContent'
import { useRecoilValue } from 'recoil'
import { SelectedAudioPlayer } from '../../atoms/atoms'
import PlayerContents from '../pages/PlayerContents'
import AudioMediaPlayer from '../AudioMediaPlayer'
import useAudioPlayer from '../../hooks/useAudioPlayer'
import ReactPlayer from 'react-player'

function PlayerModal() {

    const selectedAudio = useRecoilValue(SelectedAudioPlayer)

    return (
        <div className={`rounded-t-3xl w-full bg-white shadow-2xl scrollbar-hide
            absolute max-h-full overflow-scroll bottom-0 px-7 py-4 rounded-b-none`}>
           { selectedAudio && ( 
            <PlayerContents data={selectedAudio}>
                <AudioMediaPlayer/>
            </PlayerContents>
           ) }
        </div>
    )
}

export default PlayerModal