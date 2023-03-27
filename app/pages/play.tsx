import Head from 'next/head'
import React from 'react'
import NavigationButtons from '../components/NavigationButtons'
import PlayerContents from '../components/pages/PlayerContents'
import PhoneView from '../components/PhoneView'
import SwitchView from '../components/SwitchView'

interface Props { 
    id: string

}

function play() {
    return (
        <>
          <Head>
            <title>Hello John 👋</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          
          <div className="md:bg-[#EEEEEE] bg-white duration-700  flex min-h-screen flex-col 
            items-center justify-center md:py-2 py-14">
            <main className=" justify-center flex flex-col items-center space-y-[27px] ">
    
              <div className="flex items-center relative right-5">
                <div className='relative right-10'>
                  <NavigationButtons />        
                </div>
                <PhoneView children={<PlayerContents/>} />
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

export default play