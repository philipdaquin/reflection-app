import React from 'react'
import BackButton from '../BackButton'
import { AudioData } from '../../typings'
import Link from 'next/link'
import AudioEntry from '../AudioEntry'

interface Props { 
    entries: AudioData[] | null
  }
  

function SeeAllContent({entries}: Props) {
    
    // @ts-ignore
    entries.sort((a, b) => new Date(b.date.toString()) - new Date(a.date.toString()))
    
    const Earliest = () => { 
    // @ts-ignore
    entries.sort((a, b) => new Date(b.date.toString()) - new Date(a.date.toString()))
        
    }

    const Oldest = () => { 
    // @ts-ignore
    entries.sort((a, b) => new Date(a.date.toString()) - new Date(b.date.toString()))
        
    }
    
    return (
        <section className='space-y-5'>  

            <div className='flex flex-row items-center justify-between'>
                <BackButton link='' />
                <h1 className='font-bold text-[15px] text-center '>Entries</h1>
                <div className='px-4 bg-black'></div>
            </div>

            <hr />

            <div>
                <div>
                    Earliest
                </div>
                
                <div>
                    
                </div>
            </div>

            <ul className='space-y-2'>
              {
                  entries?.map(({
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
                                emotion={text_classification.emotion}
                                emoji={text_classification.emotion_emoji} 
                                average_mood={text_classification.average_mood}   
                                thumbnailUrl={""}
                            />
                                
                          </Link>
                        </li>
                      )
                  })
              }
            </ul>

        </section>
    
    )
}

export default SeeAllContent