import React from 'react'
import GreetingUser from '../GreetingUser'
import MoodTrackerIndex from '../MoodTrackerIndex'
import RecentEntries, { AudioEntryType } from '../RecentEntries'
import WeeklyRoundUpComp from '../WeeklyRoundUpComp'
import { getServerSideProps } from '../../pages/post_analysis/[id]'
import { TextClassification } from '../../pages'

interface Props { 
  data: TextClassification[] | null
}

function HomeContents({data}: Props) {
  let list: AudioEntryType[] = [
    {
      id: 1,
      title: 'Intro to JavaScript',
      subtitle: '',
      date: '',
      duration: 1200,
      thumbnailUrl: 'https://images.unsplash.com/photo-1675746799064-d9bfa131e9e5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
      audioUrl: 'https://www.youtube.com/watch?v=of6MnTR_nYo'
    },
    {
      id: 2,
      title: 'React for Beginners',
      subtitle: '',
      date: '',
      duration: 1800,
      thumbnailUrl: 'https://images.unsplash.com/photo-1486915309851-b0cc1f8a0084?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8aG90fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
      audioUrl: 'https://www.youtube.com/watch?v=Ke90Tje7VS0'
    }
  ];



  return (
    <div className='bg-white md:w-full md:h-full w-full h-full rounded-[70px]'>
      <GreetingUser />
      <div className='mt-10'>
        <MoodTrackerIndex data={data}/>
      </div>

      {/* Weekly roundups  */}
      <div className='pt-7'>
        <WeeklyRoundUpComp/>
      </div>
      {/* Recent entries  */}
      <div className='pt-11'>
        <RecentEntries entries={list} />
      </div>
    </div>
  )
}

export default HomeContents

