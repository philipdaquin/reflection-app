import Head from 'next/head'
import React from 'react'
import { useAudioRecorder } from 'react-audio-voice-recorder'
import AudioControls from '../components/AudioControls'
import AudioVisualizer from '../components/AudioVisualizer'
import NavigationButtons from '../components/navigation/NavigationButtons'
import ChatContent from '../components/pages/ChatContent'
import RecordContent from '../components/pages/RecordContent'
import PhoneView from '../components/PhoneView'
import RecordComponent from '../components/RecordComponent'
import SwitchView from '../components/SwitchView'
import SettingsButtons from '../components/SettingsButtons'
import NavigationMobile from '../components/navigation/mobile/NavigationMobile'
import WeeklyCalendarContent from '../components/pages/WeeklyCalendarContent'
import HomeNav from '../components/navigation/mobile/HomeNav'
import ModalView from '../components/ModalView'
import AddEntryContent from '../components/navigation/mobile/AddEntryContent'
import { AddEntryToggle } from '../atoms/atoms'
import { useRecoilValue } from 'recoil'
import { getMoodSummary } from '../util/analysis/getMoodSummary'
import { getRecentAudioEntries } from '../util/audio/getRecentAudioEntries'
import { getAllAnalysis } from '../util/analysis/getAllAnalysis'
import { getDailyByDate } from '../util/daily/getDailyByDate'
import { GetServerSideProps } from 'next'
import { AudioData, DailySummary, TextClassification } from '../typings'


interface Props { 
  mood_data: TextClassification[] | null,
  recent_entries: AudioData[] | null,
  all_mood_data: TextClassification[] | null,
  dailyMoodSummary: DailySummary | null
}

function weekly_record({
  mood_data, 
  recent_entries, 
  all_mood_data,
  dailyMoodSummary
}: Props) {
    const showModel = useRecoilValue(AddEntryToggle);

    return (
      <>
        <Head>
            <title>Hello John 👋</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="md:bg-[#EEEEEE] bg-white flex 
        md:h-screen flex-col h-screen md:py-14 md:px-4 relative">
            <main className="justify-center flex flex-col items-center space-y-[27px] ">
                <div className="flex items-center md:relative md:right-5 h-full">
                    
                    <div className='relative right-10 hidden md:block'>
                        <NavigationButtons />       
                    </div>

                    <PhoneView>
                        <WeeklyCalendarContent 
                          all_mood_data={mood_data}
                          recent_entries={recent_entries}
                          dailyMoodSummary={dailyMoodSummary}
                        />
                    </PhoneView>
                
                </div>
                <div className='md:block hidden'>
                    <SwitchView />
                </div>
            {/* <RecordComponent /> */}
            </main>

            {/* Settings / Footer  */}
            <div className="flex-grow"></div>
            <div className='relative bottom-[170px] lg:block hidden w-full'>
                <SettingsButtons />
            </div>
            <div className='z-50 fixed bottom-0 left-1/2 transform -translate-x-1/2'>
              <div className='flex items-center  md:hidden justify-center mb-5 '>
                  <NavigationMobile children={<HomeNav/>} />        
              </div>
            </div>

            {showModel && (
          <ModalView>
            <AddEntryContent />
          </ModalView>
        )}
        </div>
      
      </>
    )
}

export default weekly_record


export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const [mood_data, recent_entries, all_mood, dailyMoodSummary] = await Promise.all([
      ( await getMoodSummary() ),
      ( await getRecentAudioEntries() ),
      ( await getAllAnalysis() ),
      ( await getDailyByDate(new Date()) )
  ]) 

  return { 
    props: { 
      mood_data,
      recent_entries,
      all_mood_data: all_mood,
      dailyMoodSummary
    }
  }
}
