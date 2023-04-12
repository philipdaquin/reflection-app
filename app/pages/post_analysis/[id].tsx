              
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import SummaryContent from '../../components/pages/SummaryContent'
import PhoneView from '../../components/PhoneView'
import PostSummaryControls from '../../components/PostSummaryControls'
import SwitchView from '../../components/SwitchView'
import { GetServerSideProps, NextPage, GetServerSidePropsContext  } from 'next';
import { getEntry } from '../../util/getEntry'
import { AudioData } from '../../typings'


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
            
            <div className="md:bg-[#EEEEEE] bg-white  flex 
                md:min-h-[100vh] flex-col h-screen md:py-14 px-[104px]">
                <main className=" justify-center flex flex-col items-center space-y-[27px] ">

                <div className="flex items-center relative right-10 space-x-5">
                    <PostSummaryControls />
                    <PhoneView children={<SummaryContent data={data}/>}/>
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