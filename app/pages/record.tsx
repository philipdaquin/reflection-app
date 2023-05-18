import Head from 'next/head'
import React from 'react'
import { useAudioRecorder } from 'react-audio-voice-recorder'
import AudioControls from '../components/controls/AudioControls'
import AudioVisualizer from '../components/AudioVisualizer'
import NavigationButtons from '../components/navigation/NavigationButtons'
import ChatContent from '../components/pages/ChatContent'
import RecordContent from '../components/pages/RecordContent'
import PhoneView from '../components/PhoneView'
import RecordComponent from '../components/RecordComponent'
import SwitchView from '../components/SwitchView'
import SettingsButtons from '../components/SettingsButtons'
import NavigationMobile from '../components/navigation/mobile/NavigationMobile'
import { useRecoilValue } from 'recoil'
import { SelectedAudioPlayer } from '../atoms/atoms'

function record() {
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
                <div className="flex items-center md:relative md:right-10 h-full">
                    
                    <div className='md:block hidden'>
                        <AudioControls />       
                    </div>


                    <PhoneView>
                      <RecordContent/>
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
              <div className='flex items-center  md:hidden justify-center sm:mb-5 mb-0 '>
                  <NavigationMobile selectedAudio={selectedAudio}>        
                    <AudioControls/>
                  </NavigationMobile >
              </div>
            </div>
        </div>
      
      </>
    )
}

export default record