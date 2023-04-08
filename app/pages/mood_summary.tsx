import Head from 'next/head'
import React from 'react'
import MoodSummaryContents from '../components/MoodSummaryContents'
import NavigationButtons from '../components/NavigationButtons'
import HomeContents from '../components/pages/HomeContents'
import PhoneView from '../components/PhoneView'
import SwitchView from '../components/SwitchView'
import { TextClassification } from '.'
import { GetServerSideProps } from 'next'


type TopMood = { 
  emoji: string | null, 
  emotion: string | null, 
  percentage: string | null
}


interface Props { 
  mood_trends: TextClassification[] | null,
  most_common_mood: TopMood[] | null, 
  mood_pattern: TextClassification[] | null
}

function mood_summary({
  mood_trends, 
  most_common_mood,
  mood_pattern
}: Props) {
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
                <PhoneView children={<MoodSummaryContents data={mood_trends}/>} />
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
    mood_trends, 
    most_common_mood, 
    // mood_patterns, 
    // recommendations
  ] = await Promise.all([

    (
      await fetch('http://localhost:4001/api/mood-summary-update')
          .then(resp => resp.json())
          .catch(err => { 
            console.error(err)
            return null
          })
    ),
    (
      await fetch('http://localhost:4001/api/get-common-mood')
          .then(resp => resp.json())
          .catch(err => { 
            console.error(err)
            return null
          })
    ),
    // (
    //   await fetch('http://localhost:4001/api/get-weekly-summary')
    //       .then(resp => resp.json())
    //       .catch(err => { 
    //         console.error(err)
    //         return null
    //       })
    // ),
    // (
    //   await fetch('http://localhost:4001/api/get-weekly-recommendation')
    //       .then(resp => resp.json())
    //       .catch(err => { 
    //         console.error(err)
    //         return null
    //       })
    // ),
  

  ]) 

  console.log(most_common_mood)

  return { 
    props: { 
      mood_trends,
      most_common_mood, 
      mood_patterns: null
    }
  }
}