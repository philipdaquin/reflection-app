import Link from 'next/link'
import React from 'react'
import SmallButton from '../button/SmallButton'


const pressKit = "https://pool-butter-d20.notion.site/Press-Kit-83a9e92ee14843568292a67a4c5910f5?pvs=4"
const privacy = "https://pool-butter-d20.notion.site/Privacy-Policy-14d9a4c9d7f942e1963b6396eaca04ec?pvs=4"
const terms =  "https://pool-butter-d20.notion.site/Terms-of-Use-45ba05ce29c645febeede5c5066623ea?pvs=4"

type PrivacyLinks = { 
  link: string, 
  title: string
} 


function TermsPrivacy() {

  const links: PrivacyLinks[] = [
    {
      link: pressKit,
      title: "Press Kit"
    }, 
    {
      link: privacy,
      title: "Privacy"
    }, 
    {
      link: terms,
      title: "Terms of Use"
    }, 

  ] 


  return (
    <div className='px-[52px] space-y-7 flex flex-col justify-center items-center w-[411px] pt-14'>
          <h1 className='text-[13px] text-center text-[#757575]'>By clicking above, you agree to our 
            <span className='font-semibold underline'> Terms of User </span> and <span className='font-semibold underline'>Privacy Policy</span>.
          </h1>
          
          <div className='flex flex-row justify-between items-center w-full px-8 text-xs'>

            
            {links.map(({link, title}) => {
              return (
                <Link href={link} rel="noopener noreferrer" target="_blank">     
                  <SmallButton title={title} />
                </Link>
              )
            } )}


            
           


          </div>
    </div>
  )
}

export default TermsPrivacy