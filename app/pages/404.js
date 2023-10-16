import { Head } from "next/document";
import Home from ".";
import ErrorPageContent from "../components/pages/ErrorPageContent";
import PhoneView from "../components/PhoneView";
import SwitchView from "../components/navigation/desktop/MobileNavigation";
import SettingsButtons from "../components/SettingsButtons";
import NavigationMobile from "../components/navigation/mobile/NavigationMobile";
import HomeNav from "../components/navigation/mobile/HomeNav";
/// temporary  error page 
export default function _404() {
  return (
    // <>
    //   <Head>
    //       <title>Hello John 👋</title>
    //       <link rel="icon" href="/favicon.ico" />
    //   </Head>

    //   <div className="md:bg-[#EEEEEE] bg-white flex 
    //       md:min-h-[100vh] flex-col h-screen md:py-14 px-[104px]">
    //       <main className="justify-center flex flex-col items-center space-y-[27px] ">
    //           <div className="flex items-center md:relative md:right-10 h-full">
    //               <PhoneView children={<ErrorPageContent/>} />
    //           </div>
    //           <div className='md:block hidden'>
    //               <SwitchView />
    //           </div>
    //       {/* <RecordComponent /> */}
    //       </main>

    //       {/* Settings / Footer  */}
    //       <div className="flex-grow"></div>
    //       <div className='relative bottom-10 md:block hidden'>
    //           <SettingsButtons />
    //       </div>
    //       <div className='flex items-center md:hidden justify-center mb-10'>
    //           <NavigationMobile children={<HomeNav/>} />        
    //       </div>
    //   </div>
    
    // </>
    <Home />
  )
  }