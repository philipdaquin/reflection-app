              
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'
import SummaryContent from '../components/pages/SummaryContent'
import PhoneView from '../components/PhoneView'
import PostSummaryControls from '../components/PostSummaryControls'
import SwitchView from '../components/SwitchView'
import { getTextSummary } from '../util/getTextSummary'
import { GetServerSideProps, NextPage } from 'next';
import { getRelatedTags } from '../util/getRelatedTags'

//
// url/post_analysis/id_url
interface Props { 
    orginalAudio: string
    // title: string
    summary: string
    tags: string[]
    transcript: string[]
}

function post_analysis({
    orginalAudio,
    // title,
    summary,
    tags,
    transcript
}: Props) {

    const router = useRouter()
    // const data = router.query

    return (
        <>
            <Head>
                <title>Hello John 👋</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            
            <div className="md:bg-[#EEEEEE] bg-white duration-700  flex min-h-screen flex-col 
                items-center justify-center md:py-2 py-14">
                <main className=" justify-center flex flex-col items-center space-y-[27px] ">

                <div className="flex items-center relative right-10 space-x-5">
                    <PostSummaryControls />
                    <PhoneView children={
                        <SummaryContent 
                            audioUrl={orginalAudio}
                            summary={summary}
                            tags={tags}
                            // title={}
                            transcript={transcript}
                        />
                    }/>
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

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
    // if (!query.data) return 
    
    const {transcript, orginalAudio, summary, tags} = JSON.parse(query.data)
    console.log(tags)
    return {
        props: { 
            orginalAudio,
            // title,
            summary: summary,
            tags,
            transcript
        },
    };
};