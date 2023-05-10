import Head from 'next/head'
import React from 'react'
import ListeningContent from '../../components/pages/TriggerContent'
import PhoneView from '../../components/PhoneView'
import SwitchView from '../../components/SwitchView'
import { AudioData } from '../../typings'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { getEntry } from '../../util/audio/getEntry'
import PreviewEntryContent from '../../components/pages/PreviewEntryContent'
import NavigationButtons from '../../components/navigation/NavigationButtons'
import SettingsButtons from '../../components/SettingsButtons'
import NavigationMobile from '../../components/navigation/mobile/NavigationMobile'
import HomeNav from '../../components/navigation/mobile/HomeNav'
import ModalView from '../../components/ModalView'
import AddEntryContent from '../../components/navigation/mobile/AddEntryContent'
import { useRecoilValue } from 'recoil'
import { AddEntryToggle } from '../../atoms/atoms'


interface Props { 
  data: AudioData | null
}

function preview({data}: Props) {
    const showModel = useRecoilValue(AddEntryToggle);

    return (
        <>
          <Head>
            <title>Hello John 👋</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          
          <div className="md:bg-[#EEEEEE] bg-white flex 
            md:min-h-[100vh] flex-col h-screen md:py-14 md:px-[104px] relative">

            <main className="justify-center flex flex-col items-center space-y-[27px]">
              <div className="flex items-center md:relative md:right-5 h-full">
                <div className='relative right-10 hidden md:block'>
                  <NavigationButtons />        
                </div>
                
                <PhoneView>
                  {/* <HomeContents 
                    mood_data={mood_data}
                    recent_entries={recent_entries}  
                  /> */}
                <PreviewEntryContent entry={data}/>
              </PhoneView>
              </div>
              <div className='md:block hidden'>
                <SwitchView />
              </div>
            </main>
            
            {/* Settings / Footer  */}
            <div className="flex-grow"></div>
            <div className='relative bottom-10 md:block hidden '>
              <SettingsButtons />
            </div>

            <div className='z-50 fixed bottom-0 left-1/2 transform -translate-x-1/2'>
              <div className='flex items-center  md:hidden justify-center mb-10 '>
                  <NavigationMobile children={<HomeNav/>} />        
              </div>
            </div>

              {/* <RecordComponent /> */}
              {showModel && (
                <ModalView>
                  <AddEntryContent />
                </ModalView>
              )}
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