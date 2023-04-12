import Head from 'next/head'
import React from 'react'
import ListeningContent from '../components/pages/ListeningContent'
import PhoneView from '../components/PhoneView'
import SwitchView from '../components/SwitchView'


function listen() {
    return (
        <>
          <Head>
            <title>Hello John 👋</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          
          <div className="md:bg-[#EEEEEE] bg-white  flex 
           md:min-h-[100vh] flex-col h-screen md:py-14 px-[104px]">
            <main className=" justify-center flex flex-col items-center space-y-[27px] ">
    
              <div className="flex items-center relative right-5">
                <PhoneView children={<ListeningContent/>} />
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

export default listen