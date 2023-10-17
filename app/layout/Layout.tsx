import React, { useEffect } from 'react'
import { Player } from '../components/AudioMediaPlayer';
import { useRecoilValue } from 'recoil';
import { AddEntryToggle, CurrentProgress, ShowAudioPlayer } from '../atoms/atoms';
import ModalView from '../components/modals/ModalView';
import AddEntryContent from '../components/navigation/mobile/AddEntryContent';
import PlayerModal from '../components/modals/PlayerModal';
import { useRouter } from 'next/router';
import { Toaster, toast } from 'react-hot-toast';
import { UploadProgress } from '../components/AddAudioFile';
import useUploadContext, { UploadProgressProvider } from '../hooks/useUploadProgress';
import { initialiseAPIKeys } from '../pages';
import Footer from './footer/Footer';
import Headers from './headers/Headers';

interface Props { 
  children: any
}

function Layout({children}: Props) {

    // const currentProgress = useRecoilValue(CurrentProgress);
   

    // Initialise API 
    //  NEEDS ITS OWN CONTEXT with the  User info + Authentication  
    initialiseAPIKeys()
    


    return (
      <div className='relative font-primary min-h-full bg-white dark:bg-gray-900'>   
        <Headers />
        {/* <div className='lg:block hidden w-full '>

        </div> */}
        {children}


        {/* <div className="flex-grow hidden lg:block"></div> */}
        {/* <div className='absolute bottom-3  lg:block hidden w-full md:px-4'>
          <SettingsButtons />
        </div> */}

      </div>
    )
}

export default Layout