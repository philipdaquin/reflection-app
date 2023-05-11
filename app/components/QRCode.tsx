import Image from 'next/image'
import React from 'react'

import img from '../public/qrcode.svg'

function QRCode() {
  return (
    <div className=' items-center space-y-2 rounded-xl bg-white px-4 py-3 flex flex-col justify-center shadow-sm drop-shadow-sm'>
        <Image src={img} height={130} width={130} alt='QrCode'/>  
        <h1 className='text-sm   text-center text-[#757575]'>
            Open on your phone
        </h1>
    </div>
  )
}

export default QRCode