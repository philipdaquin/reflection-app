import React, { MutableRefObject } from 'react'
import { useRecoilValue } from 'recoil'
import { SelectedAudioPlayer } from '../../atoms/atoms'
import PlayerContents from '../pages/PlayerContents'
import AudioMediaPlayer from '../AudioMediaPlayer'
import { motion, AnimatePresence } from 'framer-motion';
function PlayerModal() {

    const selectedAudio = useRecoilValue(SelectedAudioPlayer)

    return (
        <motion.div 
            initial={{ y: "100%" }}
            animate={{
            y: 0,
            transition: { duration: 0.5, ease: [0.36, 0.66, 0.04, 1] },
            }}
            exit={{
            y: "100%",
            transition: { duration: 0.3, ease: [0.36, 0.66, 0.04, 1] },
            }}
            className={`rounded-t-3xl w-full bg-white shadow-2xl scrollbar-hide
            absolute max-h-full overflow-scroll bottom-0 px-7 py-4 rounded-b-none`}>
           { selectedAudio && ( 
            <PlayerContents data={selectedAudio}>
                <AudioMediaPlayer data={selectedAudio}/>
            </PlayerContents>
           ) }
        </motion.div>
    )
}

export default PlayerModal