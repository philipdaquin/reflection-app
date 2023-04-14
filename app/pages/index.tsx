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
import useLocalStorage, { ELEVEN_LABS_KEY, OPENAI_KEY, initialiseAPIKeys } from '../hooks/useLocalStorage'




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
      
      <div className="md:bg-[#EEEEEE] bg-white  flex 
        md:min-h-[100vh] flex-col h-screen md:py-14 px-[104px]">


        <main className="justify-center flex flex-col items-center space-y-[27px]">
          <div className="flex items-center relative right-5 h-full">
            <div className='relative right-10 hidden md:block'>
              <NavigationButtons />        
            </div>
            <div className='absolute bottom-0 md:hidden'>
              <NavigationButtons />        
            </div>
            <PhoneView children={<HomeContents data={data}/>} />
          </div>
          <div className='md:block hidden'>
              <SwitchView />
          </div>
        </main>

        {/* Settings / Footer  */}
        <div className="flex-grow"></div>
        <div className='relative bottom-10 md:block hidden '>
          <SettingsButtons />
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

  console.log(response)

  return { 
    props: { 
      data: response
    }
  }
}