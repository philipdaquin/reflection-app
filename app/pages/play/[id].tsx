import Head from 'next/head'
import React from 'react'
import NavigationButtons from '../../components/navigation/NavigationButtons'
import PlayerContents from '../../components/pages/PlayerContents'
import PhoneView from '../../components/PhoneView'
import SwitchView from '../../components/SwitchView'
import { useRouter } from 'next/router'
import { GetServerSideProps } from 'next'
import { utimes } from 'fs'
import { AudioEntryType } from '../../typings'

interface Props { 
  entry: AudioEntryType
}

function play({entry}: Props) {

    const router = useRouter();
    // const { id } = router.query

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
                <div className='relative right-10'>
                  <NavigationButtons />        
                </div>
                <PhoneView children={<PlayerContents entry={entry}/>} />
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



export const getServerSideProps: GetServerSideProps<Props> = async () => {
  // if (!query || typeof query.data !== 'string') { 
  //     return { 
  //         notFound: false
  //     }
  // }
  // const {id} = JSON.parse(query.data)

  let list: AudioEntryType[] = [
    {
      id: 1,
      title: 'Intro to JavaScript',
      subtitle: 'EP1',
      date: 'March 4, 2023',
      duration: 1200,
      thumbnailUrl: 'https://images.unsplash.com/photo-1675746799064-d9bfa131e9e5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
      audioUrl: 'https://www.youtube.com/watch?v=of6MnTR_nYo'
    },
    {
      id: 2,
      title: 'React for Beginners',
      subtitle: 'EP2',
      date: 'March 1, 2021',
      duration: 1800,
      thumbnailUrl: 'https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8aG90fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
      audioUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0'
    }
  ];

  
  return {
      props: { 
          entry: list[0]
      },
  };
};