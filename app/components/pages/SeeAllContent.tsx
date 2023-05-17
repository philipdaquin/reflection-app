import React, { useEffect, useState } from 'react'
import BackButton from '../BackButton'
import { AudioData, EntryType } from '../../typings'
import Link from 'next/link'
import AudioEntry from '../AudioEntry'

interface EntryProps { 
  date: string, 
  entries: AudioData[]
}

function DateWithEntry({date, entries}: EntryProps) { 

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const currDate = new Date(date)
    let date_ = currDate.getDay()
    let day = daysOfWeek[date_]
    const d = currDate.getDate()
    const month = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currDate);
    const year = currDate.getFullYear();
    let dateKey = `${day}, ${d} ${month} ${year}`

    return (
      <div key={date}  className='space-y-4'>
            <h2 className='font-semibold text-lg '>{dateKey}</h2>
            <ul className='space-y-2'>
                {
                  entries?.map(({_id, date, text_classification, title, }, k) => { 
                      return (
                        <li key={k}>
                            <AudioEntry  
                                id= {_id}
                                title= {title}
                                duration={10} 
                                date={date.toString()} 
                                emotion={text_classification?.emotion || "NaN"}
                                emoji={text_classification?.emotion_emoji || "NaN"} 
                                average_mood={text_classification?.average_mood || 0}   
                                thumbnailUrl={""}
                            />
                        </li>
                      )
                  })
                }
            </ul> 
      </div>
    )
}



interface Props { 
    entries: AudioData[] | null
  }
  

function SeeAllContent({entries}: Props) {
    
    
    // const data: EntryType[] | undefined = entries?.map((item, i) => new EntryType(item)) || [] 
    const data: AudioData[] | undefined | null = entries || [] 
    // @ts-ignore
    data.sort((a, b) => new Date(b.date.toString()) - new Date(a.date.toString()))
    // Date | EntryType[]
    let dateMap: Map<string, AudioData[]> = new Map()
    for (let item of data) { 
        let currDate = new Date(item.date)
        currDate.setHours(0, 0, 0, 0)
   
        let key = currDate.toString()

        if (!dateMap.has(key)) { 
          dateMap.set(key, [item])
        } else { 
          dateMap.get(key)?.push(item)
        }
    }


    const [dateByMap, setDateByMap] = useState([])
    useEffect(() => {
      if (!entries || !dateMap) return 

      const entriesByDate: any = [];
      dateMap.forEach((entries, key) => {
        entriesByDate.push(<DateWithEntry entries={entries} date={key}/>);
      });
      setDateByMap(entriesByDate)
    }, [entries, dateMap])

    // entries.sort((a, b) => new Date(b.date.toString()) - new Date(a.date.toString()))
    const Earliest = () => { 
      if (!dateByMap) return 
      
      // @ts-ignore
      const sortedKeys = Array.from(dateMap.keys()).sort((a, b) => new Date(a) - new Date(b))
      const entriesByDate: any = [];
      dateMap.forEach((entries, key) => {
        entriesByDate.push(<DateWithEntry entries={entries} date={key}/>);
      });
      setDateByMap(entriesByDate)
    }
    const Oldest = () => { 
      if (!dateByMap) return 

      // @ts-ignore
      const sortedKeys = Array.from(dateMap.keys()).sort((a, b) => new Date(b) - new Date(a))
      const entriesByDate: any = [];
      dateMap.forEach((entries, key) => {
        entriesByDate.push(<DateWithEntry entries={entries} date={key}/>);
      });
      setDateByMap(entriesByDate)
    }
    
  
    
    
    return (
        <section className='space-y-5'>  

            <div className='flex flex-row items-center justify-between'>
                <BackButton />
                <h1 className='font-bold text-[15px] text-center '>Entries</h1>
                <div className='px-4 bg-black'></div>
            </div>

            <hr />

            <div className='space-x-2'>
                <button onClick={Earliest} 
                  className='cursor-pointer  text-xs text-white font-semibold
                            rounded-full px-4 py-1 bg-black'>
                    Earliest
                </button>
                
                <button onClick={Oldest} className='cursor-pointer font-medium text-xs text-white 
                            rounded-full px-4 py-1 bg-black'>
                    Oldest
                </button>
            </div>
            {dateByMap}
        
        </section>
    
    )
}

export default SeeAllContent