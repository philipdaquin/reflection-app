import Head from 'next/head'
import React from 'react'
import NavigationButtons from '../components/navigation/NavigationButtons'
import ChatContent from '../components/pages/ChatContent'
import PhoneView from '../components/PhoneView'
import SwitchView from '../components/SwitchView'
import AudioControls from '../components/AudioControls'
import ChatControls from '../components/ChatControls'
import NavigationMobile from '../components/navigation/mobile/NavigationMobile'
import SettingsButtons from '../components/SettingsButtons'
import HomeNav from '../components/navigation/mobile/HomeNav'

function chat() {
    return (
        <>
        <Head>
            <title>Hello John 👋</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        
        <div className="md:bg-[#EEEEEE] bg-white flex 
            md:h-screen flex-col h-screen md:py-5 lg:py-14 md:px-4 relative">

            <main className=" justify-center flex flex-col items-center space-y-[27px] md:h-full">
                <div className="flex items-center md:relative md:right-9 h-full">
                    <div className='md:block hidden'>
                        <ChatControls />       
                    </div>
                
                    <PhoneView>
                        <ChatContent/>
                    </PhoneView>
                
                </div>
                <div className='lg:block hidden'>
                    <SwitchView />
                </div>
            {/* <RecordComponent /> */}
            </main>
            {/* Settings / Footer  */}
            <div className="flex-grow hidden lg:block"></div>
            <div className='relative bottom-[140px]  lg:block hidden w-full'>
              <SettingsButtons />
            </div>
            
            <div className='z-50 fixed bottom-0 left-1/2 transform -translate-x-1/2'>
                <div className='flex items-center  md:hidden justify-center sm:mb-5 mb-0  '>
                    <NavigationMobile>        
                        <ChatControls/>
                    </NavigationMobile >
                </div>
            </div>

        </div>
        </>
    )
}

export default chat