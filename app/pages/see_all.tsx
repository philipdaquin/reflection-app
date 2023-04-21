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
import SeeAllContent from '../components/pages/SeeAllContent'
import HomeNav from '../components/navigation/mobile/HomeNav'
import { getAll } from '../util/getAll'
import { GetServerSideProps } from 'next'
import { AudioData } from '../typings'


interface Props { 
  entries: AudioData[] | null
}

function see_all({entries}: Props) {
   
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

                    <PhoneView children={<SeeAllContent entries={entries}/>} />
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
                <NavigationMobile children={<HomeNav/>} />        
            </div>
        </div>
      
      </>
    )
}

export default see_all


export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const [entries] = await Promise.all([
      ( await getAll() ),
  ]) 

  // console.log(response)

  return { 
    props: { 
      entries,
    }
  }
}
