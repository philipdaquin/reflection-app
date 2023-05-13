import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import PhoneView from '../components/PhoneView'
import RecordComponent from '../components/RecordComponent'
import SwitchView from '../components/SwitchView'
import NavigationButtons from '../components/navigation/NavigationButtons'
import HomeContents from '../components/pages/HomeContents'
import AudioVisualizer from '../components/AudioVisualizer'
import { AudioData, DailySummary, MoodFrequency, TextClassification, WeeklySummary } from '../typings'
import { getMoodSummary } from '../util/analysis/getMoodSummary'
import SettingsButtons from '../components/SettingsButtons'
import useLocalStorage, { ELEVEN_LABS_KEY, OPENAI_KEY, 
  // initialiseAPIKeys 
} from '../hooks/useLocalStorage'
import { useRecoilState, useRecoilValue } from 'recoil'
import { AddEntryToggle, CurrentWeekSummary, ElevenLabsApiKey, OpenAIApiKey, SelectedFilterOption } from '../atoms/atoms'
import NavigationMobile from '../components/navigation/mobile/NavigationMobile'
import HomeNav from '../components/navigation/mobile/HomeNav'
import { getRecentAudioEntries } from '../util/audio/getRecentAudioEntries'
import { useEffect, useState } from 'react'
import ModalView from '../components/ModalView'
import AddEntryContent from '../components/navigation/mobile/AddEntryContent'
import MoodActivityChart from '../components/MoodActivityChart'
import HomeSummaryContent from '../components/pages/HomeSummaryContent'
import { getAllAnalysis } from '../util/analysis/getAllAnalysis'
import { getDailyByDate } from '../util/daily/getDailyByDate'
import { getCurrentWeeklySummary } from '../util/weekly/getCurrentWeeklySummary'
import QRCode from '../components/QRCode'
import { getCurrentWeek } from '../util/audio/getCurrentWeek'




interface Props { 
  // mood_data: TextClassification[] | null,
  recent_entries: AudioData[] | null,
  weekly_entries: AudioData[] | null,
  all_mood_data: TextClassification[] | null,
  dailyMoodSummary: DailySummary | null,
  currentWeeklySummary: WeeklySummary | null
}


function Home({
  // mood_data, 
  recent_entries, 
  all_mood_data,
  dailyMoodSummary,
  currentWeeklySummary, 
  weekly_entries
}: Props) {

  console.log(recent_entries)
  // Start API keys 
  const [isOpen, setIsOpen] = useState(false);
  const showModel = useRecoilValue(AddEntryToggle);

  // Get the current weeks overall mood average 
  const selectedFilter = useRecoilValue(SelectedFilterOption)
  const [weeklySummary, setWeeklySummary] = useRecoilState<WeeklySummary | null>(CurrentWeekSummary)
  const [audioEntries, setAudioEntries] = useState<AudioData[] | null>(weekly_entries)
  
  useEffect(() => {
      if (!currentWeeklySummary) return
      setWeeklySummary(currentWeeklySummary) 
  }, [currentWeeklySummary]);

  useEffect(() => {

    if (!weekly_entries || !recent_entries) return 

    if (selectedFilter.label === '24H') {
      setAudioEntries(recent_entries)
    } else { 
      setAudioEntries(weekly_entries)
    }
  
  }, [
    selectedFilter, 
    weekly_entries, 
    recent_entries,
  ])
  

  return (
    <>
      <Head>
        <title>Hello John 👋</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
        
      {/*  md:px-[104px]  */}
      <div className="md:bg-[#EEEEEE] bg-white flex 
        md:h-screen flex-col h-screen md:py-14 md:px-4 relative">

        <main className="justify-center flex flex-col items-center space-y-[27px]">
          <div className="flex items-center md:relative md:right-5 h-full">
            <div className='relative right-10 hidden md:block'>
              <NavigationButtons />        
            </div>
            
            <PhoneView>
              {/* <HomeContents 
                mood_data={mood_data}
                recent_entries={recent_entries}  
              /> */}
              <HomeSummaryContent 
                all_mood_data={all_mood_data}
                recent_entries={audioEntries}
                dailyMoodSummary={dailyMoodSummary}
                currentWeeklySummary={currentWeeklySummary}
              />
            </PhoneView>

          </div>
          <div className='sm:block hidden '>
              <SwitchView />
          </div>
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

        {/* <RecordComponent /> */}
        {showModel && (
          <ModalView>
            <AddEntryContent />
          </ModalView>
        )}
      </div>
    </>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const [
    mood_data, 
    recent_entries, 

    all_mood, 
    dailyMoodSummary,
    currentWeeklySummary,
    weekly_entries
  ] = await Promise.all([
      ( await getMoodSummary() ),
      ( await getRecentAudioEntries() ),
      ( await getAllAnalysis() ),
      ( await getDailyByDate(new Date()) ),
      ( await getCurrentWeeklySummary() ),
      ( await getCurrentWeek() ),
  ]) 

  return { 
    props: { 
      recent_entries,
      all_mood_data: all_mood,
      dailyMoodSummary,
      currentWeeklySummary,
      weekly_entries
    }
  }
}


export function initialiseAPIKeys() { 
  const [elevenLabsState, setelevenLabs] = useRecoilState(ElevenLabsApiKey);
  const [openAiState, setopenAi] = useRecoilState(OpenAIApiKey);
  const [OpenValue, ] = useLocalStorage(OPENAI_KEY, null);
  const [ElevenValue, ] = useLocalStorage(ELEVEN_LABS_KEY, null);
  setelevenLabs(OpenValue)
  setopenAi(ElevenValue)
}

// 
export function getOpenAPIKey(): string | null { 
  const [key, setKey] = useLocalStorage(OPENAI_KEY, null)

  
  return key
}
// 
export function getElevenLabsAPIKey(): string | null { 
  const [key, setKey] = useLocalStorage(ELEVEN_LABS_KEY, null)
  return key
}



/*
  Deletes the values under these keys
*/
export function deleteLocalStorage(): boolean {
  const keysToDelete = [OPENAI_KEY, ELEVEN_LABS_KEY];

  try {
    keysToDelete.forEach(key => {
      localStorage.removeItem(key);
    });

    console.log("Successfully deleted all keys");
    return true;
  } catch (error) {
    console.error("Failed to delete local storage keys:", error);
    return false;
  }
}

