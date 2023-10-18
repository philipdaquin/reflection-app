import Head from "next/head";
import React from "react";
import { useAudioRecorder } from "react-audio-voice-recorder";
import AudioControls from "../components/controls/AudioControls";
import AudioVisualizer from "../components/AudioVisualizer";
import NavigationButtons from "../components/navigation/NavigationButtons";
import ChatContent from "../components/pages/ChatContent";
import RecordContent from "../components/pages/RecordContent";
import PhoneView from "../components/PhoneView";
import RecordComponent from "../components/RecordComponent";
import SwitchView from "../components/navigation/desktop/MobileNavigation";
import NavigationMobile, {
  PlayerAttachment,
} from "../components/navigation/mobile/NavigationMobile";
import WeeklyCalendarContent from "../components/pages/WeeklyCalendarContent";
import HomeNav from "../components/navigation/mobile/HomeNav";
import ModalView from "../components/modals/ModalView";
import AddEntryContent from "../components/navigation/mobile/AddEntryContent";
import {
  AddEntryToggle,
  SelectedAudioPlayer,
  ShowAudioPlayer,
} from "../atoms/atoms";
import { useRecoilValue } from "recoil";
import { getMoodSummary } from "../util/analysis/getMoodSummary";
import { getRecentAudioEntries } from "../util/audio/getRecentAudioEntries";
import { getAllAnalysis } from "../util/analysis/getAllAnalysis";
import { getDailyByDate } from "../util/daily/getDailyByDate";
import { GetServerSideProps } from "next";
import { AudioData, DailySummary, TextClassification } from "../typings";
import PlayerModal from "../components/modals/PlayerModal";
import { Player } from "../components/AudioMediaPlayer";
import DesktopLogo from "../layout/headers/components/DesktopLogo";
import MobileNavigation from "../components/navigation/desktop/MobileNavigation";
import Footer from "../layout/footer/Footer";

interface Props {
  mood_data: TextClassification[] | null;
  recent_entries: AudioData[] | null;
  all_mood_data: TextClassification[] | null;
  dailyMoodSummary: DailySummary | null;
}

function weekly_record({
  mood_data,
  recent_entries,
  all_mood_data,
  dailyMoodSummary,
}: Props) {
  const showModel = useRecoilValue(AddEntryToggle);
  const showPlayer = useRecoilValue(ShowAudioPlayer);
  const selectedAudio = useRecoilValue(SelectedAudioPlayer);

  return (
    <>
      <Head>
        <title>Hello John 👋</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section
        className="md:bg-[#fffefe]
       sm:h-screen
        bg-white flex md:h-screen
        flex-col h-screen md:py-5 lg:pt-7 lg:pb-[84px] md:px-[59px] relative"
      >
        <div className="lg:block hidden w-full ">
          <DesktopLogo />
        </div>
        <main className="justify-center flex flex-col items-center space-y-[27px] md:h-full">
          <div className="flex flex-col items-center">
            <PhoneView>
              <WeeklyCalendarContent
                all_mood_data={mood_data}
                recent_entries={recent_entries}
                dailyMoodSummary={dailyMoodSummary}
              />
            </PhoneView>
            <div className="mt-[42px] z-0 md:z-50 hidden md:block">
              <MobileNavigation />
            </div>
          </div>
          <div className="fixed bottom-[15px]  lg:block hidden w-full ">
            <Footer />
          </div>
          {/* <div className='lg:block hidden'>
                    <SwitchView />
                </div> */}
          {/* <RecordComponent /> */}
        </main>
        <div className="z-50 fixed bottom-0 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center  md:hidden justify-center sm:mb-5 mb-0">
            <NavigationMobile selectedAudio={selectedAudio}>
              {selectedAudio && <PlayerAttachment audio={selectedAudio} />}
              <HomeNav />
            </NavigationMobile>
          </div>
        </div>
      </section>
    </>
  );
}

export default weekly_record;

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const [mood_data, recent_entries, all_mood, dailyMoodSummary] =
    await Promise.all([
      await getMoodSummary(),
      await getRecentAudioEntries(),
      await getAllAnalysis(),
      await getDailyByDate(new Date()),
    ]);

  return {
    props: {
      mood_data,
      recent_entries,
      all_mood_data: all_mood,
      dailyMoodSummary,
    },
  };
};
