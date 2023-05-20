import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import ListeningContent from '../../components/pages/TriggerContent'
import PhoneView from '../../components/PhoneView'
import SwitchView from '../../components/SwitchView'
import TriggerContent from '../../components/pages/TriggerContent'
import { useRecoilValue } from 'recoil'
import { AddEntryToggle, MoodTriggerPage, SelectedAudioPlayer, ShowAudioPlayer } from '../../atoms/atoms'
import { AudioData } from '../../typings'
import { GetServerSideProps } from 'next'
import { getRecentAudioEntries } from '../../util/audio/getRecentAudioEntries'
import SettingsButtons from '../../components/SettingsButtons'
import HomeNav from '../../components/navigation/mobile/HomeNav'
import NavigationMobile, { PlayerAttachment } from '../../components/navigation/mobile/NavigationMobile'
import ModalView from '../../components/modals/ModalView'
import AddEntryContent from '../../components/navigation/mobile/AddEntryContent'
import NavigationButtons from '../../components/navigation/NavigationButtons'
import { getAll } from '../../util/audio/getAll'
import PlayerModal from '../../components/modals/PlayerModal'
import { Player } from '../../components/AudioMediaPlayer'

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
          
          <div className="md:bg-[#EEEEEE] bg-white flex 
            md:h-screen flex-col h-screen md:py-5 lg:py-14 md:px-4 relative">

            <main className="justify-center flex flex-col items-center space-y-[27px] md:h-full">
              <div className="flex items-center md:relative md:right-5 h-full">
              
                <div className='relative right-10 hidden md:block'>
                  <NavigationButtons />        
                </div>
            
                <PhoneView>
                  <TriggerContent 
                    moodTrigger={moodTrigger} 
                    entries={audioData}
                  />
                </PhoneView>

              </div>

              <div className='lg:block hidden'>
                <SwitchView />
              </div>

            </main>

             {/* Settings / Footer  */}
            <div className="flex-grow hidden lg:block"></div>
            <div className='relative bottom-[140px]  lg:block hidden w-full'>
              <SettingsButtons />
            </div>

            <div className='z-50 fixed bottom-0 left-1/2 transform -translate-x-1/2'>
              <div className='flex items-center  md:hidden justify-center sm:mb-5 mb-0 '>
                <NavigationMobile selectedAudio={selectedAudio}>        
                  {selectedAudio && <PlayerAttachment audio={selectedAudio}/>}
                  <HomeNav/>
                </NavigationMobile >       
              </div>
            </div>

            {/* <RecordComponent /> */}
            {/* {showModel && (
              <ModalView>
                <AddEntryContent />
              </ModalView>
            )}
            {showPlayer && (
              <ModalView>
                <PlayerModal />
              </ModalView>
            )} */}
          </div>
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

