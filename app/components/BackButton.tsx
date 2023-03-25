import React from 'react'
import {ChevronLeftIcon} from '@heroicons/react/24/outline'
import Link from 'next/link'

interface Props { 
  link: string
}

function BackButton({link} : Props) {
  return (
    <Link href={"/" + `${link}`} className="cursor-pointer">
        <div className='h-[42px] w-[42px] bg-[#212121] rounded-full items-center justify-center flex'>
            <ChevronLeftIcon height={24} width={24} color="white" strokeWidth={2} />
        </div>
    </Link>
  )
}

export default BackButton