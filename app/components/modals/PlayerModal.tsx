import React from 'react'
import PreviewEntryContent from '../pages/PreviewEntryContent'
import { useRecoilValue } from 'recoil'
import { SelectedAudioPlayer } from '../../atoms/atoms'
import PlayerContents from '../pages/PlayerContents'

function PlayerModal() {

    const selectedAudio = useRecoilValue(SelectedAudioPlayer)
    return (
        <div className={`rounded-t-3xl w-full bg-white shadow-2xl absolute  h-fit bottom-0 px-7 py-4 rounded-b-none`}>
           { selectedAudio && ( <PlayerContents data={selectedAudio}/>)}
        </div>
    )
}

export default PlayerModal