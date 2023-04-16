import Link from 'next/link'
import React from 'react'

interface Props { 
    icon: any
    routerName: string
  }
  
  function NavButton({icon, routerName}: Props) { 
      return (
          <Link href={`/${routerName}`} className='cursor-pointer'>
            <div className='p-2 cursor-pointer'>
              {icon}
            </div>
          </Link>
      )
  }

export default NavButton