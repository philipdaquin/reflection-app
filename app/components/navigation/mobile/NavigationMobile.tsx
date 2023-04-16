import React from 'react'


interface Props { 
  children: any
}

function NavigationMobile({children} : Props) {
  return (
    <div className=' bg-white md:px-8 px-2 py-3 shadow-xl drop-shadow-lg rounded-3xl'>
      {children}
    </div>
  )
}

export default NavigationMobile