import Link from 'next/link'
import React from 'react'
import {TbMessageChatbot, TbTrash} from 'react-icons/tb'
import {CheckIcon} from '@heroicons/react/24/outline'
import { useRouter } from 'next/router'
import { useRecoilState, useRecoilValue } from 'recoil'
import { AddEntryToggle, AudioPlayerSource, AudioSummaryAtom, SelectedAudioPlayer } from '../atoms/atoms'
import { updateEntry } from '../util/audio/updateEntry'
import { deleteEntry } from '../util/audio/deleteEntry'
import useUploadContext from '../hooks/useUploadProgress'
import useAudioPlayer from '../hooks/useAudioPlayer'


function PostSummaryControls() {
    const router = useRouter()
    const audioData = useRecoilValue(AudioSummaryAtom);
    const [, setSelectedPlayer] = useRecoilState(SelectedAudioPlayer)
    const [, setAudioSource] = useRecoilState(AudioPlayerSource)
    const [showModal, setShowModal] = useRecoilState(AddEntryToggle);
    
    const {resetPlayer, handleDisableAutoPlay} = useAudioPlayer()
    
    // Prevents the modal from reopening after redirects
    const resetModal = () => { 
        if (showModal) setShowModal(false)

    }

    const updateData = async () => {
        if (!audioData) return 
        updateEntry(audioData)
            .then(resp => {
                // temp
                setSelectedPlayer(null)
                handleDisableAutoPlay(true)
                setAudioSource(null)
                resetPlayer(true)
                resetModal()
                router.push('/mood_summary').then(() => { 
                    router.reload()
                });

            })
            .catch(e => { 
                console.error(e)
                resetPlayer(true)
                handleDisableAutoPlay(true)

                setSelectedPlayer(null)
                setAudioSource(null)
                throw new Error(e)
            })
    }

    const delete_Entry = async () => { 
        if (!audioData) return 
        

        deleteEntry(audioData._id.toString())
            .then(resp => { 
                resetPlayer(true)
                handleDisableAutoPlay(true)

                setSelectedPlayer(null)
                setAudioSource(null)
                resetModal()
                // if False
                if (!resp) { 
                    throw new Error("Failed to delete entry")
                }

                // else 
                // route the user back to the homepage
                router.push('/').then(() => { 
                    router.reload()
                })

            }).catch(e => { 
                console.error(e)
                resetPlayer(true)

                setSelectedPlayer(null)
                setAudioSource(null)
                throw new Error(e)
            })
    }
    
    
    
    const CONTINUE = () => { 
        return (
            
            <div className='bg-[#4285f4] 
                
                h-[62px] md:h-[185px]  
                w-[185px] md:w-[62px]
                
                items-center 
                flex justify-center cursor-pointer 
                rounded-3xl'
            onClick={updateData}>
                <CheckIcon height={24} width={24} strokeWidth={2} color="white"/>
            </div>
        )
    }

    const SEND_TO_AI = () => { 
        return (
            <div className='cursor-pointer flex flex-row items-center px-3 h-fit py-3 space-x-2 rounded-3xl bg-[#424242]'
                onClick={() => router.push('/chat')}
            >
                <TbMessageChatbot size={24} color="white"/>
                {/* <h1 className='text-white font-bold text-[15px]'>Send to AI</h1> */}
            </div>
        )
    }

    const DELETE_ENTRY = () => { 
        return (
            <div className='cursor-pointer flex flex-row items-center px-3 h-fit py-3 space-x-2 rounded-3xl bg-[#E84040]'
                onClick={delete_Entry}
            >
                <TbTrash size={24} color="#fff"/>
                {/* <h1 className='text-white font-bold text-[15px]'>Send to AI</h1> */}
            </div>
        )
    }

    
    
    return (
        <div className='flex items-center space-x-2 
        relative 
        sm:pt-0
        justify-between
        px-3
        sm:space-x-5 
        sm:pb-0 
        sm:px-4 
        sm:relative 
        sm:bottom-0
        md:space-x-0 
        md:flex-col 
        md:space-y-2 
        md:relative 
        md:right-10 
        '>
            <CONTINUE />
            <div className='flex items-center space-x-2 md:flex-col  md:space-x-0 md:space-y-2'>
                <SEND_TO_AI />
                <DELETE_ENTRY />
            </div>
        </div>
    )
}

export default PostSummaryControls