import React, { useState } from 'react'
import {Cog8ToothIcon} from '@heroicons/react/24/outline'




function AddOpenAiModal() { 
    return (
        <div className='cursor-pointer rounded-[11px] w-[180px] h-full bg-black  px-2 py-3 flex flex-wrap '>
            HELLO WORLD
        </div>
    )
}
function AddElevenLabs() { 
    return (
        <div className='cursor-pointer rounded-[11px] w-[180px] h-full  hover:bg-[#F5F5F5] px-2 py-3 flex flex-wrap '>
            HELLO WORLD
        </div>
    )
}


interface SettingsProps { 
    title: string, 
    savedMessage: string,
}
function SettingSlot({title, savedMessage}: SettingsProps) { 
    
    
    
    return (
        <>  
            <div className='dropdown dropdown-right cursor-pointer rounded-[11px] w-[180px] hover:bg-[#F5F5F5] px-2 py-3 flex flex-col '>
                <label tabIndex={0} className=' text-[#505050] text-[13px] text-left w-full'>{title}</label>
                <input readOnly={true} type='password' className='outline-none text-xs bg-inherit w-full text-[#BDBDBD] tracking-widest font-light' value={savedMessage}/>
            </div>  
           
        </>
    )
}


function ShowSettings() { 
    const [openAIToggle, setOpenAiToggle] = useState(false)
    const openAIDrop = () => {setOpenAiToggle(!openAIToggle)}

    // return (
    //     <>  
    //     <div className='flex relative space-x-4 flex-row'>
    //     <div className=''>
    //             {/* {openAIToggle && } */}
    //         </div>
           
    //         <div className='bg-white dropdown dropdown-top absolute rounded-[20px] py-2 space-y-2 shadow-xl px-2 bottom-14'>
    //         <AddOpenAiModal/>

    //             <div onClick={openAIDrop}>
    //                 <SettingSlot 
    //                     savedMessage='asdasdasdas' 
    //                     title='Open AI API Key'
    //                 />
    //             </div>
    //             <SettingSlot 
    //                 savedMessage='asdsdasdasda' 
    //                 title='Eleven Labs API Key'
    //             />

    //             <div className='cursor-pointer rounded-[11px] w-[180px] hover:bg-[#F5F5F5] px-2 py-2 flex flex-wrap '>
    //                 <p className='text-[#505050] text-[13px] text-left w-full'>User</p>
    //                 <p className='text-xs bg-inherit w-full text-[#BDBDBD] '>Anonymous</p>
    //             </div>  
                
    //             <div className='w-full p-2 rounded-full px-4'>
    //                 <hr />
    //             </ div>
                
    //             <div className='w-full font-bold cursor-pointer text-white bg-[#FF4545] py-3 rounded-[11px] text-xs items-center flex justify-center'>
    //                 Delete Session Data
    //             </div>
    //         </div>
            
           
    //     </div>
    //     </>
    // )

    return (

        <div>
            
        </div>
    )

}


function SettingsToggle() { 
    const [toggle, setToggle] = useState(false)


    const openDrop = () =>  setToggle(!toggle)  

    return (
        <>  
            <div className='flex flex-col'>

                {toggle && <ShowSettings/> }

                <div className='cursor-pointer' onClick={openDrop}>
                    <Cog8ToothIcon height={24} width={24} color={`${toggle ? 'black' : '#757575'} `} />
                </div>
            </div>
        </>

    )
}


function SettingsButtons() {
  return (
    <div>
        <div className='flex items-center space-x-10'>
            <SettingsToggle />
            <div className='w-[2px] h-4 rounded-full bg-[#9e9e9e]'></div>
            <div className='text-[#757575]  text-left text-sm'>Donate</div>
        </div>
    </div>
  )
}

export default SettingsButtons