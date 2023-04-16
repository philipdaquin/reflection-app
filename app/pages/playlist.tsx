import Head from 'next/head'
import React from 'react'
import NavigationButtons from '../components/navigation/NavigationButtons'
import ChatContent from '../components/pages/ChatContent'
import LibraryContent from '../components/pages/LibraryContent'
import PhoneView from '../components/PhoneView'
import SwitchView from '../components/SwitchView'
import NavigationMobile from '../components/navigation/mobile/NavigationMobile'
import SettingsButtons from '../components/SettingsButtons'
import HomeNav from '../components/navigation/mobile/HomeNav'

function playlist() {
    return (
        <>
            <Head>
                <title>Hello John 👋</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="md:bg-[#EEEEEE] bg-white flex 
            md:min-h-[100vh] flex-col md:h-screen md:py-14 md:px-[104px] px-2">
                <main className="justify-center flex flex-col items-center space-y-[27px]">
                    <div className="flex items-center md:relative md:right-5 h-full">
                        <div className='relative right-10 hidden md:block'>
                            <NavigationButtons />        
                        </div>
                        <PhoneView children={<LibraryContent/>} />
                    </div>

                    <div className='md:block hidden '>
                        <SwitchView />
                    </div>
                </main>
            </div>
            
            {/* Settings / Footer  */}
            <div className="flex-grow"></div>
            <div className='relative bottom-10 md:block hidden '>
                <SettingsButtons />
            </div>
            <div className='flex items-center  md:hidden justify-center mb-10'>
                <NavigationMobile children={<HomeNav/>} />        
            </div>
        </>
    )
}

export default playlist