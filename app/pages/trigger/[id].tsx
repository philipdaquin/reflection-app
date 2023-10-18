import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import ListeningContent from '../../components/pages/TriggerContent'
import PhoneView from '../../components/PhoneView'
import SwitchView from '../../components/navigation/desktop/MobileNavigation'
import TriggerContent from '../../components/pages/TriggerContent'
import { useRecoilValue } from 'recoil'
import { AddEntryToggle, MoodTriggerPage, SelectedAudioPlayer, ShowAudioPlayer } from '../../atoms/atoms'
import { AudioData } from '../../typings'
import { GetServerSideProps } from 'next'
import { getRecentAudioEntries } from '../../util/audio/getRecentAudioEntries'
import HomeNav from '../../components/navigation/mobile/HomeNav'
import NavigationMobile, { PlayerAttachment } from '../../components/navigation/mobile/NavigationMobile'
import ModalView from '../../components/modals/ModalView'
import AddEntryContent from '../../components/navigation/mobile/AddEntryContent'
import NavigationButtons from '../../components/navigation/NavigationButtons'
import { getAll } from '../../util/audio/getAll'
import PlayerModal from '../../components/modals/PlayerModal'
import { Player } from '../../components/AudioMediaPlayer'
import DesktopLogo from '../../layout/headers/components/DesktopLogo'
import MobileNavigation from '../../components/navigation/desktop/MobileNavigation'
import Footer from '../../layout/footer/Footer'

interface Props { 
  data: AudioData[] | null
}


function trigger({data}: Props) {

    const moodTrigger = useRecoilValue(MoodTriggerPage)
    const showPlayer = useRecoilValue(ShowAudioPlayer);

    const [audioData, setData] = useState<AudioData[]>([])
    useEffect(() => {
      if (!data) return 

      const d: AudioData[] | undefined = data?.filter((item, i) => {
        let id = item._id
        const audio = moodTrigger?._audio_ids.find((s, v) => s === id )
        return audio !== undefined
      })
      
      setData(d)

    }, [data])
    
    const showModel = useRecoilValue(AddEntryToggle);
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
                    <TriggerContent 
                      moodTrigger={moodTrigger} 
                      entries={audioData}
                    />
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
              <div className='flex items-center  md:hidden justify-center sm:mb-5 mb-0 '>
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

export default trigger


export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const [
    recent_entries, 
  ] = await Promise.all([
      ( await getAll() ),
  ]) 

  return { 
    props: { 
      data: recent_entries,
    }
  }
}

