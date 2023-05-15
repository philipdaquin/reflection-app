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
import ModalView from '../components/ModalView'
import AddEntryContent from '../components/navigation/mobile/AddEntryContent'
import { useRecoilValue } from 'recoil'
import { AddEntryToggle } from '../atoms/atoms'

function playlist() {
    const showModel = useRecoilValue(AddEntryToggle);

    return (
        <>
            <Head>
                <title>Hello John 👋</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <div className="md:bg-[#EEEEEE] bg-white flex 
                md:h-screen flex-col h-screen md:py-14 md:px-4 relative">
                <main className="justify-center flex flex-col items-center space-y-[27px]">
                    <div className="flex items-center md:relative md:right-5 h-full">
                        <div className='relative right-10 hidden md:block'>
                            <NavigationButtons />        
                        </div>
                        <PhoneView>
                          <LibraryContent/>
                        </PhoneView>
                    </div>

                    <div className='lg:block hidden '>
                        <SwitchView />
                    </div>
                </main>
                {/* Settings / Footer  */}
                <div className="flex-grow"></div>
                <div className='relative bottom-[170px] lg:block hidden w-full'>
                    <SettingsButtons />
                </div>
                <div className='z-50 fixed bottom-0 left-1/2 transform -translate-x-1/2'>
                <div className='flex items-center  md:hidden justify-center mb-5 '>
                    <NavigationMobile children={<HomeNav/>} />        
                </div>
                </div>
                {showModel && (
                    <ModalView>
                        <AddEntryContent />
                    </ModalView>
                )}
            </div>
            
        </>
    )
}

export default playlist