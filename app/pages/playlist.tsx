import Head from "next/head";
import React from "react";
import NavigationButtons from "../components/navigation/NavigationButtons";
import ChatContent from "../components/pages/ChatContent";
import LibraryContent from "../components/pages/LibraryContent";
import PhoneView from "../components/PhoneView";
import SwitchView from "../components/navigation/desktop/MobileNavigation";
import NavigationMobile, {
  PlayerAttachment,
} from "../components/navigation/mobile/NavigationMobile";
import HomeNav from "../components/navigation/mobile/HomeNav";
import ModalView from "../components/modals/ModalView";
import AddEntryContent from "../components/navigation/mobile/AddEntryContent";
import { useRecoilValue } from "recoil";
import {
  AddEntryToggle,
  SelectedAudioPlayer,
  ShowAudioPlayer,
} from "../atoms/atoms";
import PlayerModal from "../components/modals/PlayerModal";
import { Player } from "../components/AudioMediaPlayer";
import DesktopLogo from "../layout/headers/components/DesktopLogo";
import MobileNavigation from "../components/navigation/desktop/MobileNavigation";
import Footer from "../layout/footer/Footer";

function playlist() {
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
              <LibraryContent />
            </PhoneView>
            <div className="mt-[42px] z-0 md:z-50 hidden md:block">
              <MobileNavigation />
            </div>
          </div>

          <div className="fixed bottom-[15px]  lg:block hidden w-full ">
            <Footer />
          </div>
        </main>
        <div className="z-50 fixed bottom-0 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center  md:hidden justify-center sm:mb-5 mb-0  ">
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

export default playlist;
