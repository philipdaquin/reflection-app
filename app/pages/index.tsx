import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import PhoneView from '../components/PhoneView'
import RecordComponent from '../components/RecordComponent'
import SwitchView from '../components/SwitchView'
import NavigationButtons from '../components/navigation/NavigationButtons'
import HomeContents from '../components/pages/HomeContents'
import AudioVisualizer from '../components/AudioVisualizer'
import { TextClassification } from '../typings'
import { getMoodSummary } from '../util/getMoodSummary'
import SettingsButtons from '../components/SettingsButtons'
import useLocalStorage, { ELEVEN_LABS_KEY, OPENAI_KEY, 
  // initialiseAPIKeys 
} from '../hooks/useLocalStorage'
import { useRecoilState } from 'recoil'
import { ElevenLabsApiKey, OpenAIApiKey } from '../atoms/atoms'
import NavigationMobile from '../components/navigation/mobile/NavigationMobile'
import HomeNav from '../components/navigation/mobile/HomeNav'




interface Props { 
  data: TextClassification[] | null
}


function Home({data}: Props) {

  // Start API keys 
  initialiseAPIKeys()

  return (
    <>
      <Head>
        <title>Hello John 👋</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="md:bg-[#EEEEEE] bg-white flex 
        md:min-h-[100vh] flex-col h-screen md:py-14 md:px-[104px]">

        <main className="justify-center flex flex-col items-center space-y-[27px]">
          <div className="flex items-center md:relative md:right-5 h-full">
            <div className='relative right-10 hidden md:block'>
              <NavigationButtons />        
            </div>
            <PhoneView children={<HomeContents data={data}/>} />
          </div>
          <div className='md:block hidden '>
              <SwitchView />
          </div>
        </main>

        {/* Settings / Footer  */}
        <div className="flex-grow"></div>
        <div className='relative bottom-10 md:block hidden '>
          <SettingsButtons />
        </div>
        <div className='flex items-center  md:hidden justify-center mb-10 '>
            <NavigationMobile children={<HomeNav/>} />        
        </div>
        <RecordComponent />
      </div>
    </>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const [response] = await Promise.all([
      ( await getMoodSummary() ),
  ]) 

  // console.log(response)

  return { 
    props: { 
      data: response
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

