import Head from 'next/head'
import React from 'react'
import NavigationButtons from '../components/NavigationButtons'
import ChatContent from '../components/pages/ChatContent'
import PhoneView from '../components/PhoneView'
import SwitchView from '../components/SwitchView'

function playlist() {
    return (
        <div className="md:bg-[#EEEEEE] bg-white duration-500  flex min-h-screen flex-col 
        items-center justify-center md:py-2 py-14">
        <Head>
            <title>Hello John 👋</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

            <main className=" justify-center flex flex-col items-center space-y-[27px] ">

            <div className="flex items-center relative right-5">
                <div className='relative right-10'>
                    <NavigationButtons />        
                </div>
                <PhoneView children={<ChatContent/>} />
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