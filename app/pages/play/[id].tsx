import Head from 'next/head'
import React, { useState } from 'react'
import NavigationButtons from '../../components/navigation/NavigationButtons'
import PlayerContents from '../../components/pages/PlayerContents'
import PhoneView from '../../components/PhoneView'
import SwitchView from '../../components/SwitchView'
import { useRouter } from 'next/router'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { utimes } from 'fs'
import { AudioData, AudioEntryType } from '../../typings'
import NavigationMobile from '../../components/navigation/mobile/NavigationMobile'
import SettingsButtons from '../../components/SettingsButtons'
import { getEntry } from '../../util/audio/getEntry'
import { Long, ObjectId } from 'bson'
import AudioMediaPlayer from '../../components/AudioMediaPlayer'

interface Props { 
  data: AudioData
}

function play({data}: Props) {

    const entry = new AudioEntryType(data)
    return (
        <>
          <Head>
            <title>Hello John 👋</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          
          <div className="md:bg-[#EEEEEE] bg-white flex 
            md:h-screen flex-col h-screen md:py-5 lg:py-14 md:px-4 relative">

            <main className=" justify-center flex flex-col items-center space-y-[27px] md:h-full ">
              <div className="flex items-center md:relative md:right-5 h-full ">
                <div className='relative right-10 hidden md:block'>
                  <NavigationButtons />        
                </div>

                <PhoneView>
                  <PlayerContents data={data}>
                    <AudioMediaPlayer data={data}/>
                  </PlayerContents>
                </PhoneView>

              </div>
              <div className='lg:block hidden'>
                <SwitchView />
              </div>
            </main>
             {/* Settings / Footer  */}
            <div className="flex-grow hidden lg:block"></div>
            <div className='relative bottom-[140px]  lg:block hidden w-full'>
              <SettingsButtons />
            </div>
          </div>
        </>
      )
}    

export default play



export const getServerSideProps: GetServerSideProps<Props> = async (context: GetServerSidePropsContext ) => {
  if (!context ) { 
    return { 
        notFound: true
    }
  }
  // @ts-ignore
  const { id } = context.params; // get the id from the pathname

  // fetch data from your server using the id
  const data = await getEntry(id)

  if (!data) return { 
    notFound: true
  }

  return {
      props: { 
          data
      },
  };
};