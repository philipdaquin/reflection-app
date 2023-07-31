import React from 'react'

export enum GenericButtonVariant {
  EMPTY, 
  FILLED
}


interface Props {
  title: string , 
  variant: GenericButtonVariant
}




function GenericButton({title, variant}: Props) {

  let colour = variant === GenericButtonVariant.FILLED ? 'bg-[#212121]  text-white' : 'bg-[#e0e0e0] text-[#424242]'
  return (
    <div className={`py-4 w-full items-center flex flex-row 
      transition-colors duration-200  
      justify-center ${colour} rounded-[25px]`}>
      <h1 className={`font-semibold text-[16px] `}>
        {title}                                                             
      </h1>
    </div>
  )
}

export default GenericButton