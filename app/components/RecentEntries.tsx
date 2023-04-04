import React from 'react'
import AudioEntry from './AudioEntry'
import Link from 'next/link'

export type AudioEntryType = { 
    id: number,
    title: string,
    subtitle: string,
    date: string,
    duration: number,
    thumbnailUrl: string,
    audioUrl: string
}

interface Props { 
  entries: AudioEntryType[]
}

function RecentEntries({entries}: Props) {

    return (
        <div className='space-y-5'>
            <div className='flex flex-row items-end justify-between'>
                <h1 className='text-[20px] font-bold'>Recent Entries</h1>
                <h3 className='text-[14px] text-[#757575] text-left'>See all</h3>
            </div>

            <ul className='space-y-2'>
              {
                  entries.map((item, k) => { 
                      return (
                        <li key={k}>
                          <Link href={{
                              pathname: `/play/${item.id}`,
                              // query: { id: item.id }
                            }}>
                            <AudioEntry  
                                id={item.id}
                                title={item.title}
                                duration={item.duration}
                                thumbnailUrl={item.thumbnailUrl}
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