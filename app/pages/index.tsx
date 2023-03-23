import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import PhoneView from '../components/PhoneView'
import RecordComponent from '../components/RecordComponent'
import SwitchView from '../components/SwitchView'

const Home: NextPage = () => {
  return (
    <div className="md:bg-[#EEEEEE] bg-white transition-all duration-500 ease-in-out  flex min-h-screen flex-col items-center justify-center md:py-2 py-14">
      <Head>
        <title>Hello John 👋</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className=" justify-center flex flex-col items-center space-y-[27px]">
        <PhoneView />
        <div className='md:block hidden'>
          <SwitchView />
        </div>

      {/* <RecordComponent /> */}
      </main>
    </div>
  )
}

export default Home
