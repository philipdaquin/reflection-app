import Head from 'next/head'
import React from 'react'
import NavigationButtons from '../components/navigation/NavigationButtons'
import PhoneView from '../components/PhoneView'
import SwitchView from '../components/navigation/desktop/MobileNavigation'
import NavigationMobile, { PlayerAttachment } from '../components/navigation/mobile/NavigationMobile'
import { SelectedAudioPlayer } from '../atoms/atoms'
import { useRecoilValue } from 'recoil'
import HomeNav from '../components/navigation/mobile/HomeNav'
import { GetServerSideProps } from 'next'
import DesktopLogo from '../layout/headers/components/DesktopLogo'
import MobileNavigation from '../components/navigation/desktop/MobileNavigation'
import Footer from '../layout/footer/Footer'


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
                <div className='text-center flex flex-col justify-center text-xl font-bold h-full'>This page is currently empty for now</div>
              </PhoneView>
              <div className='mt-[42px] z-0 md:z-50 hidden md:block'>
                <MobileNavigation />
              </div>
            </div>
            <div className='fixed bottom-[15px]  lg:block hidden w-full '>
              <Footer />
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
        </section>
      </>
    )
}

export default collections


// export const getServerSideProps: GetServerSideProps<Props> = async () => {
 
// }
