import Link from 'next/link'
import React from 'react'

interface Props { 
    icon: any
    routerName: string,
    title?: string
  }
  
  function NavButton({icon, routerName, title}: Props) { 
    const onHover = " button active:bg-[#E0E0E0] rounded-md"

      return (
          <Link href={`/${routerName}`} className='cursor-pointer flex flex-col space-y-2 items-center justify-center'>
            <div className={`p-0 cursor-pointer ${onHover}`}>
              {icon}
            </div>
            

            {
              title && (
                <p className='text-xs font-semibold text-[#9e9e9e] text-center'>
                  {title}
                </p>
              )
            }


          </Link>
      )
  }

export default NavButton