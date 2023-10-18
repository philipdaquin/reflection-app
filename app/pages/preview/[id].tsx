import Head from 'next/head'
import React, { useEffect } from 'react'
import ListeningContent from '../../components/pages/TriggerContent'
import PhoneView from '../../components/PhoneView'
import SwitchView from '../../components/navigation/desktop/MobileNavigation'
import { AudioData } from '../../typings'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { getEntry } from '../../util/audio/getEntry'
import PreviewEntryContent from '../../components/pages/PreviewEntryContent'
import NavigationButtons from '../../components/navigation/NavigationButtons'
import NavigationMobile, { PlayerAttachment } from '../../components/navigation/mobile/NavigationMobile'
import HomeNav from '../../components/navigation/mobile/HomeNav'
import ModalView from '../../components/modals/ModalView'
import AddEntryContent from '../../components/navigation/mobile/AddEntryContent'
import { useRecoilState, useRecoilValue } from 'recoil'
import { AddEntryToggle, AudioPlayerSource, SelectedAudioPlayer, ShowAudioPlayer } from '../../atoms/atoms'
import PlayerModal from '../../components/modals/PlayerModal'
import useAudioPlayer from '../../hooks/useAudioPlayer'
import { Player } from '../../components/AudioMediaPlayer'
import DesktopLogo from '../../layout/headers/components/DesktopLogo'
import MobileNavigation from '../../components/navigation/desktop/MobileNavigation'
import Footer from '../../layout/footer/Footer'


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
          
          <section className="md:bg-[#fffefe]
            sm:h-screen
          bg-white flex md:h-screen
            flex-col h-screen md:py-5 lg:pt-7 lg:pb-[84px] md:px-[59px] relative">
            <div className='lg:block hidden w-full '>
              <DesktopLogo />
            </div>
            {/* <AddAPIKeys redirectLink={""} title='Eleven Labs' apiKeyName={""}/> */}
            <main className="justify-center flex flex-col items-center space-y-[27px] md:h-full">
              <div className="flex flex-col items-center">
                <PhoneView>
                { data && <PreviewEntryContent entry={data}/>}
              </PhoneView>
              <div className='mt-[42px] z-0 md:z-50 hidden md:block'>
                <MobileNavigation />
              </div>
              </div>
              <div className='fixed bottom-[15px]  lg:block hidden w-full '>
              <Footer />
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
            </section>
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