import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import PhoneView from '../components/PhoneView'
import SwitchView from '../components/SwitchView'
import NavigationButtons from '../components/navigation/NavigationButtons'
import { AudioData, DailySummary, MoodFrequency, TextClassification, WeeklySummary } from '../typings'
import { getMoodSummary } from '../util/analysis/getMoodSummary'
import SettingsButtons from '../components/SettingsButtons'
import useLocalStorage, { ELEVEN_LABS_KEY, OPENAI_KEY, 
  // initialiseAPIKeys 
} from '../hooks/useLocalStorage'
import { useRecoilState, useRecoilValue } from 'recoil'
import { AddEntryToggle, CurrentWeekSummary, ElevenLabsApiKey, OpenAIApiKey, SelectedAudioPlayer, SelectedFilterOption, ShowAudioPlayer } from '../atoms/atoms'
import NavigationMobile, { PlayerAttachment } from '../components/navigation/mobile/NavigationMobile'
import HomeNav from '../components/navigation/mobile/HomeNav'
import { getRecentAudioEntries } from '../util/audio/getRecentAudioEntries'
import { useEffect, useState } from 'react'
import AddEntryContent from '../components/navigation/mobile/AddEntryContent'
import MoodActivityChart from '../components/MoodActivityChart'
import HomeSummaryContent from '../components/pages/HomeSummaryContent'
import { getAllAnalysis } from '../util/analysis/getAllAnalysis'
import { getDailyByDate } from '../util/daily/getDailyByDate'
import { getCurrentWeeklySummary } from '../util/weekly/getCurrentWeeklySummary'
import QRCode from '../components/QRCode'
import { getCurrentWeek } from '../util/audio/getCurrentWeek'
import PlayerModal from '../components/modals/PlayerModal'
import ModalView from '../components/modals/ModalView'
import useAudioPlayer from '../hooks/useAudioPlayer'
import { Player } from '../components/AudioMediaPlayer'




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
  const selectedAudio = useRecoilValue(SelectedAudioPlayer)
  return (
    <>
      <Head>
        <title>Hello to Reflection V1  👋</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
        
      {/*  md:px-[104px]  */}
      <div className="md:bg-[#EEEEEE] bg-white flex 
            md:h-screen flex-col h-screen md:py-5 lg:py-14 md:px-4 relative">

        <main className="justify-center flex flex-col items-center space-y-[27px] md:h-full">
          <div className="flex items-center md:relative md:right-5">
            <div className='relative right-10 hidden md:block'>
              <NavigationButtons />        
            </div>

            <PhoneView>
              <HomeSummaryContent 
                all_mood_data={all_mood_data}
                recent_entries={audioEntries}
                dailyMoodSummary={dailyMoodSummary}
                currentWeeklySummary={currentWeeklySummary}
              />
            </PhoneView>

          </div>
          {/* <div className='lg:block hidden '>
              <SwitchView />
          </div>
           */}
        </main> 
        <div className='z-50 fixed bottom-0 left-1/2 transform -translate-x-1/2'>
          <div className='flex items-center md:hidden justify-center sm:mb-5 mb-0 '>
              <NavigationMobile selectedAudio={selectedAudio}>      
                {selectedAudio && <PlayerAttachment audio={selectedAudio}/>}
                <HomeNav/>
              </NavigationMobile >        
          </div>
        </div>
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

