import Image from 'next/image'
import React from 'react'

import img from '../public/qrcode.png'

function QRCode() {
  return (
    <div className=' items-center space-y-1 rounded-xl bg-white px-4 py-3 flex flex-col justify-center shadow-sm drop-shadow-sm'>
        <h1 className='text-sm font-semibold  text-center'>
            Open on your phone
        </h1>
        <Image src={img} height={120} width={120} alt='QrCode'/>  
    </div>
  )
}

export default QRCode