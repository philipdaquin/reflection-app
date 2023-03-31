import Head from 'next/head'
import React from 'react'
import MoodSummaryContents from '../components/MoodSummaryContents'
import NavigationButtons from '../components/NavigationButtons'
import HomeContents from '../components/pages/HomeContents'
import PhoneView from '../components/PhoneView'
import SwitchView from '../components/SwitchView'

function mood_summary() {
    return (
        <>
          <Head>
            <title>Hello John 👋</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          
          <div className="md:bg-[#EEEEEE] bg-white duration-700  flex min-h-screen flex-col 
            items-center justify-center md:py-2 py-14">
            <main className=" justify-center flex flex-col items-center space-y-[27px] ">
              <div className="flex items-center">
                <div className='relative right-10'>
                  <NavigationButtons />        
                </div>
                <PhoneView children={<MoodSummaryContents/>} />
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

export default mood_summary