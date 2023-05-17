import Head from 'next/head'
import React from 'react'
import { useAudioRecorder } from 'react-audio-voice-recorder'
import AudioControls from '../components/AudioControls'
import AudioVisualizer from '../components/AudioVisualizer'
import NavigationButtons from '../components/navigation/NavigationButtons'
import ChatContent from '../components/pages/ChatContent'
import RecordContent from '../components/pages/RecordContent'
import PhoneView from '../components/PhoneView'
import RecordComponent from '../components/RecordComponent'
import SwitchView from '../components/SwitchView'
import SettingsButtons from '../components/SettingsButtons'
import NavigationMobile, { PlayerAttachment } from '../components/navigation/mobile/NavigationMobile'
import SeeAllContent from '../components/pages/SeeAllContent'
import HomeNav from '../components/navigation/mobile/HomeNav'
import { GetServerSideProps } from 'next'
import { AudioData } from '../typings'
import { getAll } from '../util/audio/getAll'
import { Toaster } from 'react-hot-toast'
import { useRecoilValue } from 'recoil'
import { AddEntryToggle, SelectedAudioPlayer, ShowAudioPlayer } from '../atoms/atoms'
import ModalView from '../components/modals/ModalView'
import AddEntryContent from '../components/navigation/mobile/AddEntryContent'
import PlayerModal from '../components/modals/PlayerModal'
import { Player } from '../components/AudioMediaPlayer'


interface Props { 
  entries: AudioData[] | null
}

function see_all({entries}: Props) {
    const showModel = useRecoilValue(AddEntryToggle);
    const showPlayer = useRecoilValue(ShowAudioPlayer);
    const selectedAudio = useRecoilValue(SelectedAudioPlayer)

    return (
      <>
        <Head>
            <title>Hello John 👋</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="md:bg-[#EEEEEE] bg-white flex 
            md:h-screen flex-col h-screen md:py-5 lg:py-14 md:px-4 relative">
            <main className="justify-center flex flex-col items-center space-y-[27px] md:h-full">
                <div className="flex items-center md:relative md:right-5 h-full">
                  <div className='relative right-10 hidden md:block'>
                    <NavigationButtons />        
                  </div>

                    <PhoneView>
                      <SeeAllContent entries={entries}/>
                    </PhoneView>
                
                </div>
                <div className='lg:block hidden'>
                    <SwitchView />
                </div>
            {/* <RecordComponent /> */}
            </main>

            {/* Settings / Footer  */}
            <div className="flex-grow hidden lg:block"></div>
            <div className='relative bottom-[140px]  lg:block hidden w-full'>
              <SettingsButtons />
            </div>
            
            <div className='z-50 fixed bottom-0 left-1/2 transform -translate-x-1/2'>
              <div className='flex items-center  md:hidden justify-center  sm:mb-5 mb-0  '>
                <Player/>
                <NavigationMobile selectedAudio={selectedAudio}>      
                  {selectedAudio && <PlayerAttachment audio={selectedAudio}/>}

                  <HomeNav/>
                </NavigationMobile >        
              </div>
            </div>
            {showModel && (
              <ModalView>
                <AddEntryContent />
              </ModalView>
            )}
            {showPlayer && (
              <ModalView>
                <PlayerModal />
              </ModalView>
            )}
        </div>
      
      </>
    )
}

export default see_all


export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const [entries] = await Promise.all([
      ( await getAll() ),
  ]) 
  if (!entries) return { 
    notFound: true
  }
  
  // console.log(response)

  return { 
    props: { 
      entries,
    }
  }
}
