import React, { useEffect, useState } from 'react'
import BackButton from '../BackButton'
import { AudioData, MoodFrequency, MoodTriggerType } from '../../typings'
import DailyAudioEntries from '../moodWidgets/DailyAudioEntries'
import MoodActivityWidget from '../moodWidgets/MoodActivityWidget'
import MoodCompositionWidget from '../moodWidgets/MoodCompositionWidget'
import { InsightContainer } from '../moodWidgets/MoodInsightWidget'
import { useRecoilValue } from 'recoil'
import { SelectedFilterOption } from '../../atoms/atoms'

interface Props { 
  moodTrigger: MoodFrequency | null,
  entries: AudioData[] | null
}


function TriggerContent({moodTrigger, entries}: Props) {

  let emotion =` ${moodTrigger?.emotion_emoji} ${moodTrigger?.emotion}`
  let count = (moodTrigger?.count || 0).toString()
  let percentage = parseInt(moodTrigger?.percentage || "").toFixed(2) || "0" 

  const analysis = entries?.map((item, i) => item.text_classification) || []
  return (
    <>
      <div className='flex flex-row items-center justify-between'>
        <BackButton/>
        <h1 className='font-bold text-[15px] text-center '>{emotion}</h1>
        <div className='px-4 bg-black'></div>
      </div>

      <div className='pt-8 space-y-6'>
        <div className='flex space-x-4 '>
          <InsightContainer date={count} title='Total Entries'/>
          <InsightContainer date={percentage + "%"} title='Total Average'/>
        </div>
        {/* <MoodCompositionWidget data={[]}/>  */}
        <MoodActivityWidget entries={analysis}/>
        <DailyAudioEntries entries={entries}/>
      </div>
    </>
  )
}

export default TriggerContent