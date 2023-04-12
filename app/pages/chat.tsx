import Head from 'next/head'
import React from 'react'
import NavigationButtons from '../components/navigation/NavigationButtons'
import ChatContent from '../components/pages/ChatContent'
import PhoneView from '../components/PhoneView'
import SwitchView from '../components/SwitchView'
import AudioControls from '../components/AudioControls'
import ChatControls from '../components/ChatControls'

function chat() {
    return (
        <>
        <Head>
            <title>Hello John 👋</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        
        <div className="md:bg-[#EEEEEE] bg-white  flex 
        md:min-h-[100vh] flex-col h-screen md:py-14 px-[104px]">

            <main className=" justify-center flex flex-col items-center space-y-[27px]  ">

            <div className="flex items-center relative right-10 space-x-5">
                <ChatControls />       
                <PhoneView children={<ChatContent/>} />
            </div>
            <div className='md:block hidden'>
                <SwitchView />
            </div>
            {/* <RecordComponent /> */}
            </main>
        </div>
        </>
    )
}

export default chat