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
import NavigationMobile from '../components/navigation/mobile/NavigationMobile'

function record() {
   
    return (
      <>
        <Head>
            <title>Hello John 👋</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="md:bg-[#EEEEEE] bg-white flex 
            md:min-h-[100vh] flex-col h-screen md:py-14 px-[104px]">
            <main className="justify-center flex flex-col items-center space-y-[27px] ">
                <div className="flex items-center md:relative md:right-10 h-full">
                    
                    <div className='md:block hidden'>
                        <AudioControls />       
                    </div>

                    <PhoneView children={<RecordContent/>} />
                </div>
                <div className='md:block hidden'>
                    <SwitchView />
                </div>
            {/* <RecordComponent /> */}
            </main>

            {/* Settings / Footer  */}
            <div className="flex-grow"></div>
            <div className='relative bottom-10 md:block hidden'>
                <SettingsButtons />
            </div>
            <div className='flex items-center md:hidden justify-center mb-10'>
                <NavigationMobile children={<AudioControls/>} />        
            </div>
        </div>
      
      </>
    )
}

export default record