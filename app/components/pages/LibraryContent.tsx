import React from 'react'
import BackButton from '../button/BackButton'

interface Props { 
  title: string 
}


function LibraryContent() {
  return (
    <>
      <div className='flex flex-row items-center justify-between'>
        <BackButton link='' />
        <h1 className='font-bold text-sm text-center'>My March Memories</h1>
        <div></div>
      </div>
    </>
  )
}
export default LibraryContent
