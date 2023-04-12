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

function record() {
   
    return (
      <>
        <Head>
            <title>Hello John 👋</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="md:bg-[#EEEEEE] bg-white  flex 
            md:min-h-[100vh] flex-col h-screen md:py-14 px-[104px]">
            <main className=" justify-center flex flex-col items-center space-y-[27px] ">
                <div className="flex items-center relative right-10 space-x-5">
                    <AudioControls />       
                    <PhoneView children={<RecordContent/>} />
                </div>
                <div className='md:block hidden'>
                    <SwitchView />
                </div>
            {/* <RecordComponent /> */}
        
            </main>
        </div>
      
      </>
    )
}

export default record