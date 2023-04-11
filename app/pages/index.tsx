import type { GetServerSideProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import PhoneView from '../components/PhoneView'
import RecordComponent from '../components/RecordComponent'
import SwitchView from '../components/SwitchView'
import NavigationButtons from '../components/NavigationButtons'
import HomeContents from '../components/pages/HomeContents'
import AudioVisualizer from '../components/AudioVisualizer'
import { TextClassification } from '../typings'




interface Props { 
  data: TextClassification[] | null
}


function Home({data}: Props) {
  return (
    <>
      <Head>
        <title>Hello John 👋</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="md:bg-[#EEEEEE] bg-white duration-700  flex min-h-screen flex-col 
        items-center justify-center md:py-2 py-14">
        <main className=" justify-center flex flex-col items-center space-y-[27px] ">

          <div className="flex items-center relative right-5">
            <div className='relative right-10'>
              <NavigationButtons />        
            </div>
            <PhoneView children={<HomeContents data={data}/>} />
          </div>
          <div className='md:block hidden'>
            <SwitchView />
          </div>
        <RecordComponent />

        </main>
      </div>
    </>
  )
}

export default Home

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  const [response] = await Promise.all([
    (
      await fetch('http://localhost:4001/api/analysis/get-mood-summary')
          .then(resp => resp.json())
          .catch(err => { 
            console.error(err)
            return null
          })
    )
  ]) 

  console.log(response)

  return { 
    props: { 
      data: response
    }
  }
}