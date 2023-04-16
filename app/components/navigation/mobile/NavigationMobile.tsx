import React from 'react'


interface Props { 
  children: any
}

function NavigationMobile({children} : Props) {
  return (
    <div className=' bg-white px-8 py-3 shadow-xl drop-shadow-lg rounded-3xl'>
      {children}
    </div>
  )
}

export default NavigationMobile