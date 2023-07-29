import React from 'react'

function TermsPrivacy() {
  return (
    <div className='px-[52px] space-y-7 flex flex-col justify-center items-center w-[411px] pt-14'>
          <h1 className='text-[14px] text-center text-[#757575]'>By clicking above, you agree to our 
            <span className='font-semibold underline'> Terms of User </span> and <span className='font-semibold underline'>Privacy Policy</span>.
          </h1>
          
          <div className='flex flex-row justify-between items-center w-full px-8'>
            <h1 className='text-[12px] text-[#757575] font-medium'>Press Kit</h1>
            <h1 className='text-[12px] text-[#757575] font-medium'>Privacy</h1>
            <h1 className='text-[12px] text-[#757575] font-medium'>Terms of Use</h1>
          </div>
    </div>
  )
}

export default TermsPrivacy