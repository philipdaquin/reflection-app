              
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import SummaryContent from '../../components/pages/SummaryContent'
import PhoneView from '../../components/PhoneView'
import PostSummaryControls from '../../components/PostSummaryControls'
import SwitchView from '../../components/SwitchView'
import { GetServerSideProps, NextPage, GetServerSidePropsContext  } from 'next';
import { getEntry } from '../../util/audio/getEntry'
import { AudioData } from '../../typings'
import SettingsButtons from '../../components/SettingsButtons'
import NavigationMobile from '../../components/navigation/mobile/NavigationMobile'
import AudioControls from '../../components/AudioControls'


interface Props { 
    data: AudioData 
}

function post_analysis({
   data
}: Props) {

    const router = useRouter()
    // const data = router.query

    return (
        <>
            <Head>
                <title>Hello John 👋</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            
            <div className="md:bg-[#EEEEEE] bg-white flex 
            md:h-screen flex-col h-screen md:py-5 lg:py-14 md:px-4 relative">
                <main className=" justify-center flex flex-col items-center space-y-[27px] md:h-full ">
                <div className="flex items-center md:relative md:right-10 h-full">
                    
                    <div className='md:block hidden'>
                        <PostSummaryControls />
                    </div>
                    <PhoneView>
                       <SummaryContent data={data}/>
                    </PhoneView>
                </div>
                <div className='lg:block hidden'>
                    <SwitchView />
                </div>
                    {/* <RecordComponent /> */}
                </main>
                {/* Settings / Footer  */}
                <div className="flex-grow hidden lg:block"></div>
                <div className='relative bottom-[140px]  lg:block hidden w-full'>
                    <SettingsButtons />
                </div>

                <div className='z-50 fixed bottom-0 left-1/2 transform -translate-x-1/2'>
                    <div className='flex items-center  md:hidden justify-center sm:mb-5 mb-0 '>
                        <NavigationMobile children={<PostSummaryControls/>} />        
                    </div>
                </div>


            </div>
        </>
    )
}

export default post_analysis
// @ts-ignore
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
  
    // return the data as props to the component
    return {
      props: {
        data
      }
    };
  }