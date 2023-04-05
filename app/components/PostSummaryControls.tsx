import Link from 'next/link'
import React from 'react'
import {TbMessageChatbot} from 'react-icons/tb'
import {CheckIcon} from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'
import { AudioSummaryAtom } from '../atoms/atoms'
import { updateEntry } from '../util/updateEntry'


function PostSummaryControls() {
    const router = useRouter()
    const audioData = useRecoilValue(AudioSummaryAtom);
    
    const updateData = async () => {
        if (!audioData) return 
        updateEntry(audioData)
            .then(resp => {
                router.push('/mood_summary')
            })
            .catch(e => { 
                console.error(e)
                throw new Error(e)
            })
    }
    
    
    
    const CONTINUE = () => { 
        return (
            
            <div className='bg-[#4285f4] h-full items-center flex justify-center cursor-pointer rounded-full px-5 py-3'
            onClick={updateData}>
                <CheckIcon height={24} width={24} strokeWidth={2} color="white"/>
                {/* <h1 className='text-[15px] text-white font-bold text-center'>

                </h1> */}
            </div>
        )
    }

    const SEND_TO_AI = () => { 
        return (
            <div className='cursor-pointer flex flex-row items-center px-5 h-fit py-3 space-x-2 rounded-full bg-[#424242]'
                onClick={() => router.push('/chat')}
            >
                <TbMessageChatbot size={27} color="white"/>
                {/* <h1 className='text-white font-bold text-[15px]'>Send to AI</h1> */}
            </div>
        )
    }
    
    
    return (
        <div className='space-y-2 flex flex-col h-[250px] w-[62px] justify-between'>
            <CONTINUE />
            <SEND_TO_AI />
        </div>
    )
}

export default PostSummaryControls