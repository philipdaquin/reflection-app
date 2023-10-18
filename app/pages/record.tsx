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
import NavigationMobile from "../components/navigation/mobile/NavigationMobile";
import { useRecoilValue } from "recoil";
import { SelectedAudioPlayer } from "../atoms/atoms";
import DesktopLogo from "../layout/headers/components/DesktopLogo";
import MobileNavigation from "../components/navigation/desktop/MobileNavigation";
import Footer from "../layout/footer/Footer";

function record() {
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
          <div className="flex items-center md:relative md:right-10 h-full">
            <div className="md:block hidden">
              <AudioControls />
            </div>

            <PhoneView>
              <RecordContent />
            </PhoneView>
          </div>
          <div className="lg:block  z-0 md:z-50 hidden md:block">
            <MobileNavigation />
          </div>
          <div className="fixed bottom-[15px]  lg:block hidden w-full ">
            <Footer />
          </div>
          {/* <RecordComponent /> */}
        </main>
        <div className="z-50 fixed bottom-0 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center  md:hidden justify-center sm:mb-5 mb-0 ">
            <NavigationMobile selectedAudio={selectedAudio}>
              <AudioControls />
            </NavigationMobile>
          </div>
        </div>
      </section>
    </>
  );
}

export default record;
