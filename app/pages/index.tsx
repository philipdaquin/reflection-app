import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import PhoneView from '../components/PhoneView'
import RecordComponent from '../components/RecordComponent'
import SwitchView from '../components/SwitchView'

const Home: NextPage = () => {
  return (
    <div className="bg-[#EEEEEE] flex min-h-screen flex-col items-center justify-center py-2">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className=" justify-center flex flex-col items-center space-y-[27px]">
        <PhoneView />
        <SwitchView />

      {/* <RecordComponent /> */}
      </main>
    </div>
  )
}

export default Home
