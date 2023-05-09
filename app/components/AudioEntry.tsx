import { ObjectId } from 'bson'
import Image from 'next/image'
import React, { useState } from 'react'
import {ChevronRightIcon, EllipsisHorizontalCircleIcon, PencilSquareIcon, EllipsisHorizontalIcon, LinkIcon} from '@heroicons/react/24/outline'
import { recentEntryTimeStamp } from '../util/recentEntryTimeStamp'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { toast } from 'react-hot-toast'

interface LinkProps { 
  link: string
}

function LinkButton({link}: LinkProps) { 
  const [openToggle, setOpenToggle] = useState(false)
  const copy_text = () => { 
    setOpenToggle(true);
    toast("✅ Copied Link")
    let fullLink = `http://localhost:3000/play/${link}`
    navigator.clipboard.writeText(fullLink);
  }  
  return (
    <div className=' flex flex-row items-center space-x-2 ' onClick={copy_text}>
      <LinkIcon height={20} width={20} color='#757575'/>
      <h1 className='text-xs'>
        Copy Link
      </h1>
    </div>
  )
}

function EditButton({link}: LinkProps) { 
  return (
    <Link href={`/post_analysis/${link}`}>
      <div className=' flex flex-row items-center space-x-2 '>
        <PencilSquareIcon height={20} width={20} color='#757575'/>
        <h1 className='text-xs'>
          Edit
        </h1>
      </div>
    </Link>
  )
}


interface Props { 
    id: string,
    title: string | null, 
    duration: number | null,
    date: string | null, 
    emotion: string | null,
    emoji: string | null,
    average_mood: number | null,
    thumbnailUrl: string | null | undefined
}

const IMAGE_URL: string = 'https://images.unsplash.com/photo-1669264879269-e58825475223?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=764&q=80'
function AudioEntry({
    id,
    title,
    date,
    duration,
    emotion,
    emoji,
    average_mood,
    thumbnailUrl
  
  }: Props) {

    console.log(date)

    if (!thumbnailUrl) thumbnailUrl = IMAGE_URL
    const adate =  recentEntryTimeStamp(date!)
    let avg = average_mood? average_mood * 10 : null
    const onHover = "hover:bg-[#f5f5f5] active:bg-[#f5f5f5] rounded-xl "

    const router = useRouter()

  return (
    <>
      <div className='items-end flex-row flex justify-between bg-[#F5F5F5] rounded-2xl px-2 py-2'>
        <Link href={{
            pathname: `/play/${id.toString()}`,
            // query: { id: item.id }
          }}> 
          <div className='w-full  h-full '>
            <div className='flex flex-row justify-between'>
              
              <div className='flex flex-row space-x-2 items-start'>
                <Image src={thumbnailUrl} 
                    className='w-[61px] h-[61px] rounded-xl bg-[#d9d9d9]' 
                    alt='User Profile'  
                    height={61}
                    width={61}
                    quality={100}
                /> 
                <div className='text-left flex flex-col space-y-1'>
                  <div>
                    <p className='text-sm font-medium'>{title}</p>
                    <div className='flex flex-row space-x-2'>
                      
                      { date && (
                          <>
                            <p className='text-[11px] text-[#757575]'>{adate}</p>
                            <p className='text-[11px] text-[#757575]'>•</p>
                          </>
                        )
                      }

                      <p className='text-[11px] text-[#757575]'>{duration} min</p>
                      
                      {
                        emotion && (
                          <>
                            <p className='text-[11px] text-[#757575]'>•</p>
                            <p className='text-[11px] text-[#757575]'>{emotion}</p>
                          </>
                        )
                      }
                      
                    </div>
                  </div>

                  <div className='flex w-fit space-x-1 items-center '>
                    <p className='text-sm text-[#757575] font-medium'>{emoji} {avg} / 10</p>
                  </div>
                </div>
              </div>
            </div>
          </div> 
        </Link> 
        <div className={`cursor-pointer border-[1px] rounded-full border-[#757575] hover:bg-[#D9D9D9] dropdown dropdown-end`}>
            <EllipsisHorizontalIcon tabIndex={0} height={18} width={18} color='#757575'/>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-40">
              <li><LinkButton link={id}/></li>
              <li><EditButton link={id}/></li>
            </ul>
        </div>
      </div>
    </>
  )
}

export default AudioEntry