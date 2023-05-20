import Head from 'next/head'
import React, { useEffect } from 'react'
import ListeningContent from '../../components/pages/TriggerContent'
import PhoneView from '../../components/PhoneView'
import SwitchView from '../../components/SwitchView'
import { AudioData } from '../../typings'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { getEntry } from '../../util/audio/getEntry'
import PreviewEntryContent from '../../components/pages/PreviewEntryContent'
import NavigationButtons from '../../components/navigation/NavigationButtons'
import SettingsButtons from '../../components/SettingsButtons'
import NavigationMobile, { PlayerAttachment } from '../../components/navigation/mobile/NavigationMobile'
import HomeNav from '../../components/navigation/mobile/HomeNav'
import ModalView from '../../components/modals/ModalView'
import AddEntryContent from '../../components/navigation/mobile/AddEntryContent'
import { useRecoilState, useRecoilValue } from 'recoil'
import { AddEntryToggle, AudioPlayerSource, SelectedAudioPlayer, ShowAudioPlayer } from '../../atoms/atoms'
import PlayerModal from '../../components/modals/PlayerModal'
import useAudioPlayer from '../../hooks/useAudioPlayer'
import { Player } from '../../components/AudioMediaPlayer'


interface Props { 
  data: AudioData | null
}

function preview({data}: Props) {
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
                { data && <PreviewEntryContent entry={data}/>}
              </PhoneView>
              </div>
              <div className='lg:block hidden'>
                <SwitchView />
              </div>
            </main>
            <div className='z-50 fixed bottom-0 left-1/2 transform -translate-x-1/2'>
              <div className='flex items-center  md:hidden justify-center  sm:mb-5 mb-0'>
                <NavigationMobile selectedAudio={selectedAudio}>        
                  {selectedAudio && <PlayerAttachment audio={selectedAudio}/>}
                  <HomeNav/>
                </NavigationMobile >                 
              </div>
            </div>
            </div>
        </>
    )
}

export default preview


export const getServerSideProps: GetServerSideProps<Props> = async (context: GetServerSidePropsContext ) => {
  if (!context ) { 
    return { 
        notFound: true
    }
  }
  // @ts-ignore
  const { id } = context.params; // get the id from the pathname

  // fetch data from your server using the id
  const data = await getEntry(id)

  if (!data) return { 
    notFound: true
  }

  return {
      props: { 
          data
      },
  };
};