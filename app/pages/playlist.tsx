import Head from 'next/head'
import React from 'react'
import NavigationButtons from '../components/navigation/NavigationButtons'
import ChatContent from '../components/pages/ChatContent'
import LibraryContent from '../components/pages/LibraryContent'
import PhoneView from '../components/PhoneView'
import SwitchView from '../components/SwitchView'

function playlist() {
    return (
        <div className="md:bg-[#EEEEEE] bg-white  flex 
        md:min-h-[100vh] flex-col h-screen md:py-14 px-[104px]">
        <Head>
            <title>Hello John 👋</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

            <main className=" justify-center flex flex-col items-center space-y-[27px] ">

            <div className="flex items-center relative right-5">
                <div className='relative right-10'>
                    <NavigationButtons />        
                </div>
                <PhoneView children={<LibraryContent/>} />
            </div>
            <div className='md:block hidden'>
                <SwitchView />
            </div>
            {/* <RecordComponent /> */}
            </main>
        </div>
    )
}

export default playlist