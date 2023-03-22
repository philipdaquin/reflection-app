import React from 'react'
import AudioEntry from './AudioEntry'

type AudioEntryType = { 
    id: number,
    title: string,
    duration: number
    thumbnailUrl: string
}



function RecentEntries() {

    let list: AudioEntryType[] = [
        {
          id: 1,
          title: 'Intro to JavaScript',
          duration: 1200,
          thumbnailUrl: 'https://example.com/thumbnails/1.jpg'
        },
        {
          id: 2,
          title: 'Python for Beginners',
          duration: 1800,
          thumbnailUrl: 'https://example.com/thumbnails/2.jpg'
        },
        {
          id: 1,
          title: 'Intro to JavaScript',
          duration: 1200,
          thumbnailUrl: 'https://example.com/thumbnails/1.jpg'
        },
        {
          id: 2,
          title: 'Python for Beginners',
          duration: 1800,
          thumbnailUrl: 'https://example.com/thumbnails/2.jpg'
        },
        {
          id: 3,
          title: 'React Hooks Tutorial',
          duration: 900,
          thumbnailUrl: 'https://example.com/thumbnails/3.jpg'
        }
      ].slice(0, 3);


    return (
        <div className='space-y-5'>
            <div className='flex flex-row items-end justify-between'>
                <h1 className='text-[20px] font-bold'>Recent Entries</h1>
                <h3 className='text-[14px] text-[#757575] text-left'>See all</h3>
            </div>

            {
                list.map(({id, title, duration, thumbnailUrl}, k) => { 
                    return <AudioEntry  
                        id={id}
                        title={title}
                        duration={duration}
                        thumbnailUrl={thumbnailUrl}
                    />
                })
            }
        </div>
    )
}

export default RecentEntries