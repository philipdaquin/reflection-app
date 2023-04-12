import Head from 'next/head'
import React from 'react'
import MoodSummaryContents from '../components/MoodSummaryContents'
import NavigationButtons from '../components/navigation/NavigationButtons'
import HomeContents from '../components/pages/HomeContents'
import PhoneView from '../components/PhoneView'
import SwitchView from '../components/SwitchView'
import { GetServerSideProps } from 'next'
import { TextClassification, TopMood, WeeklySummary } from '../typings'
import { getMoodSummary } from '../util/getMoodSummary'
import { getWeeklySummary } from '../util/getWeeklySummary'



interface Props { 
  mood_graph: TextClassification[] | null,
  weekly_summary: WeeklySummary | null
}

function mood_summary({
  mood_graph, 
  weekly_summary
}: Props) {
    return (
        <>
          <Head>
            <title>Hello John 👋</title>
            <link rel="icon" href="/favicon.ico" />
          </Head>
          
          <div className="md:bg-[#EEEEEE] bg-white  flex 
        md:min-h-[100vh] flex-col h-screen md:py-14 px-[104px]">
            <main className=" justify-center flex flex-col items-center space-y-[27px] ">
              <div className="flex items-center">
                <div className='relative right-10'>
                  <NavigationButtons />        
                </div>
                <PhoneView children={
                  <MoodSummaryContents 
                  mood_graph={mood_graph}
                  weekly_summary={weekly_summary}
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

export default mood_summary


export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const [
    mood_graph, 
    weekly_summary
  ] = await Promise.all([
    ( await getMoodSummary() ),
    ( await getWeeklySummary() )
  ]) 

  return { 
    props: { 
      mood_graph,
      weekly_summary
    }
  }
}