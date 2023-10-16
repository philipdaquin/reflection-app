import React from 'react'
import Image from 'next/image'

import img from '../../../public/qrcode.svg'
function QRmodal() {
  return (
    <div className='w-[221px] h-[304px] items-center rounded-xl bg-white px-[15px] pb-[20px] pt-[14px] 
      flex flex-col space-y-3' 
      style={{ boxShadow: '0 1px 20px 0 rgba(0, 0, 0, 0.25)' }}
      >
        <div className='flex flex-col space-y-3.5'>
          <h1 className='text-[13px] text-left text-[#424242] font-semibold'>
              Open on your phone
          </h1>
          <p className='text-[#9e9e9e] text-xs text-left font-medium'>
            Scan with your phone's camera or QR code app to view.
          </p>
        </div>
        <div className='items-center flex justify-center bg-[#E0E0E0]/50 rounded-[10px] w-full h-full'>
          <Image src={img} height={132} width={132} alt='QrCode'/>  
        </div>
    </div>
  )
}

export default QRmodal