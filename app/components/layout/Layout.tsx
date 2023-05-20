import React, { useEffect } from 'react'
import { Player } from '../AudioMediaPlayer';
import { useRecoilValue } from 'recoil';
import { AddEntryToggle, CurrentProgress, ShowAudioPlayer } from '../../atoms/atoms';
import ModalView from '../modals/ModalView';
import AddEntryContent from '../navigation/mobile/AddEntryContent';
import PlayerModal from '../modals/PlayerModal';
import { useRouter } from 'next/router';
import { Toaster, toast } from 'react-hot-toast';
import { UploadProgress } from '../AddAudioFile';
import { UploadProgressProvider } from '../../hooks/useUploadProgress';
import { initialiseAPIKeys } from '../../pages';

interface Props { 
  children: any
}

function Layout({children}: Props) {
    const showModel = useRecoilValue(AddEntryToggle);
    const showPlayer = useRecoilValue(ShowAudioPlayer);
    // const currentProgress = useRecoilValue(CurrentProgress);
    const router = useRouter()

    // Initialise API 
    //  NEEDS ITS OWN CONTEXT with the  User info + Authentication  
    initialiseAPIKeys()
    
    const isAudioPlayingPage =
      router.pathname === '/chat' ||
      router.pathname === '/record' ||
      router.pathname === '/mood_summary' ||
      router.pathname.startsWith('/post_analysis/');
    

    return (
      <div>   
        <UploadProgressProvider>
        <Toaster
            position="top-center"
            reverseOrder={false}
          />
        <Player />
        
        {children}

        { !isAudioPlayingPage && 
          (showModel || showPlayer) && (
            <ModalView>
              {showModel && <AddEntryContent />}
              {showPlayer && <PlayerModal />}
            </ModalView>
          )
        }
        </UploadProgressProvider>
      </div>
    )
}

export default Layout