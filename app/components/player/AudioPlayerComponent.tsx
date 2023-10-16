import { useRouter } from 'next/router';
import React from 'react'
import { useRecoilValue } from 'recoil';
import { AddEntryToggle, ShowAudioPlayer } from '../../atoms/atoms';
import ModalView from '../modals/ModalView';
import PlayerModal from '../modals/PlayerModal';
import AddEntryContent from '../navigation/mobile/AddEntryContent';
import { Player } from '../AudioMediaPlayer';

function AudioPlayerComponent() {
    const router = useRouter()

    const isAudioPlayingPage =
        router.pathname === '/chat' ||
        router.pathname === '/record' ||
        router.pathname === '/mood_summary' ||
        router.pathname.startsWith('/post_analysis/');
    const showModel = useRecoilValue(AddEntryToggle);
    const showPlayer = useRecoilValue(ShowAudioPlayer);
  
    return (
        <div>
            <Player />

            { 
            !isAudioPlayingPage && 
            (showModel || showPlayer) && (
                <ModalView>
                {showModel && <AddEntryContent />}
                {showPlayer && <PlayerModal />}
                </ModalView>
            )
            }   

        </div>
  )
}

export default AudioPlayerComponent