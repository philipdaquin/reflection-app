import Image from 'next/image'
import React, { useState } from 'react'

import img from '../public/qrcode.svg'
import { IoIosQrScanner, IoIosSquareOutline} from 'react-icons/io'

function QRButton() {
  return (

    <div className='items-center flex flex-col space-y-2'>
      <div className='w-[59px] h-[59px] items-center flex justify-center rounded-full hover:bg-[#EEEEE]' style={{boxShadow: '0 2px 10px 0 rgba(0, 0, 0, 0.25)'}}>
        <IoIosQrScanner size={24} color='#757575' />
      </div>
      <p className='text-[#757575] text-xs font-normal'>Mobile</p>
    </div>
  )
}

export default QRButton