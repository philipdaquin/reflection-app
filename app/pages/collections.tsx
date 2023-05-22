import Head from 'next/head'
import React from 'react'
import NavigationButtons from '../components/navigation/NavigationButtons'
import PhoneView from '../components/PhoneView'
import SwitchView from '../components/SwitchView'
import NavigationMobile, { PlayerAttachment } from '../components/navigation/mobile/NavigationMobile'
import { SelectedAudioPlayer } from '../atoms/atoms'
import { useRecoilValue } from 'recoil'
import HomeNav from '../components/navigation/mobile/HomeNav'
import { GetServerSideProps } from 'next'


interface Props { 
}

function collections({}: Props) {
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
                    </PhoneView>
                
                </div>
                <div className='lg:block hidden'>
                    <SwitchView />
                </div>
            {/* <RecordComponent /> */}
            </main>
            <div className='z-50 fixed bottom-0 left-1/2 transform -translate-x-1/2'>
              <div className='flex items-center  md:hidden justify-center  sm:mb-5 mb-0  '>
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

export default collections


// export const getServerSideProps: GetServerSideProps<Props> = async () => {
 
// }
