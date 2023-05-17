import React from 'react'
import AudioEntry from './AudioEntry'
import Link from 'next/link'
import { AudioData, AudioEntryType } from '../typings'


interface Props { 
  // entries: AudioEntryType[] | null | undefined
  entries: AudioData[] | null
}

function RecentEntries({entries}: Props) {
    let entry = entries || []
    // @ts-ignore
    entry.sort((a, b) => new Date(b.date.toString()) - new Date(a.date.toString()))

    return (
        <div className='space-y-5'>
            <div className='flex flex-row items-end justify-between'>
                <h1 className='text-[20px] font-bold'>Recent Entries</h1>
                <Link href={'/see_all'} className='text-[14px] text-[#757575] text-left hover:underline'>See all</Link>
            </div>

            <ul className='space-y-2'>
              {
                  entry?.map(({
                    _id, date, day, summary, tags, text_classification, title, transcription
                  }, k) => { 
                      return (
                        <li key={k}>
                          <Link href={{
                              pathname: `/play/${_id.toString()}`,
                              // query: { id: item.id }
                            }}>
                            <AudioEntry  
                                id= {_id}
                                title= {title}
                                duration={10} 
                                date={date.toString()} 
                                emotion={text_classification?.emotion || ""}
                                emoji={text_classification?.emotion_emoji || ""}  
                                average_mood={text_classification?.average_mood || 0}   
                                thumbnailUrl={""}
                            />
                                
                          </Link>
                        </li>
                      )
                  })
              }
            </ul>
        </div>
    )
}

export default RecentEntries