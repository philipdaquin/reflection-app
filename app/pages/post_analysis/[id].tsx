              
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import SummaryContent from '../../components/pages/SummaryContent'
import PhoneView from '../../components/PhoneView'
import PostSummaryControls from '../../components/PostSummaryControls'
import SwitchView from '../../components/navigation/desktop/MobileNavigation'
import { GetServerSideProps, NextPage, GetServerSidePropsContext  } from 'next';
import { getEntry } from '../../util/audio/getEntry'
import { AudioData } from '../../typings'
import NavigationMobile, { PlayerAttachment } from '../../components/navigation/mobile/NavigationMobile'
import { useRecoilValue } from 'recoil'
import { SelectedAudioPlayer } from '../../atoms/atoms'
import DesktopLogo from '../../layout/headers/components/DesktopLogo'
import MobileNavigation from '../../components/navigation/desktop/MobileNavigation'
import Footer from '../../layout/footer/Footer'


interface Props { 
    data: AudioData 
}

function post_analysis({data}: Props) {
    const router = useRouter()
    const selectedAudio = useRecoilValue(SelectedAudioPlayer)

    return (
        <>
            <Head>
                <title>Hello John 👋</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            
            <section className="md:bg-[#fffefe]
                sm:h-screen
                bg-white flex md:h-screen
                flex-col h-screen md:py-5 lg:pt-7 lg:pb-[84px] md:px-[59px] relative">
                <div className='lg:block hidden w-full '>
                    <DesktopLogo />
                </div>
                <main className=" justify-center flex flex-col items-center space-y-[27px] md:h-full ">
                    <div className="flex items-center md:relative md:right-10 h-full">
                        
                        <div className='md:block hidden'>
                            <PostSummaryControls />
                        </div>
                        <PhoneView>
                        <SummaryContent data={data}/>
                        </PhoneView>
                    </div>
                    <div className='lg:block z-0 md:z-50 hidden'>
                        <MobileNavigation />
                    </div>
                    <div className='fixed bottom-[15px]  lg:block hidden w-full '>
                        <Footer />
                    </div>
                    {/* <RecordComponent /> */}
                </main>
                <div className='z-50 fixed bottom-0 left-1/2 transform -translate-x-1/2'>
                    <div className='flex items-center  md:hidden justify-center sm:mb-5 mb-0 '>
                        <NavigationMobile selectedAudio={selectedAudio}>       
                            {/* {selectedAudio && <PlayerAttachment audio={selectedAudio}/>}, */}
                            <PostSummaryControls/> 
                        </NavigationMobile >        
                    </div>
                </div>
            </section>
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