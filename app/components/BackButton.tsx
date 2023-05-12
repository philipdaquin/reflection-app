import React, { useState } from 'react'
import {ChevronLeftIcon} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/router'

interface Props { 
  link?: string
}


function BackButton({link}: Props) {

  const [canGoBack, setCanGoBack] = useState(false)

  const router = useRouter()

  const goBack = () => {
    if (canGoBack) window.history.back()
  }

  const handleClick = () => { 
    if (link) { 
      router.push(`/ + ${link}`)
    } else { 
      setCanGoBack(true)
      goBack()
    }
  }

    
  return (
    <div onClick={handleClick} className='cursor-pointer h-[42px] w-[42px] bg-[#212121] rounded-full items-center justify-center flex'>
        <ChevronLeftIcon height={24} width={24} color="white" strokeWidth={2} />
    </div>
  )
}

export default BackButton