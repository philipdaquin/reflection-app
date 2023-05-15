import Link from 'next/link'
import React from 'react'

interface Props { 
    icon: any
    routerName: string
  }
  
  function NavButton({icon, routerName}: Props) { 
    const onHover = "hover:bg-[#f5f5f5] active:bg-[#E0E0E0] rounded-full"

      return (
          <Link href={`/${routerName}`} className='cursor-pointer'>
            <div className={`p-2 cursor-pointer ${onHover}`}>
              {icon}
            </div>
          </Link>
      )
  }

export default NavButton