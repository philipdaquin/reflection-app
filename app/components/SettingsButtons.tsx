import React, { ChangeEvent, ReactEventHandler, ReactHTMLElement, useEffect, useMemo, useRef, useState } from 'react'
import {Cog8ToothIcon, ArrowUpRightIcon} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useRouter } from 'next/router'
import useLocalStorage from '../hooks/useLocalStorage'
import { useRecoilState, useRecoilValue } from 'recoil'
import { ElevenLabsApiKey, OpenAIApiKey } from '../atoms/atoms'
import { deleteLocalStorage, initialiseAPIKeys } from '../pages'
import QRCode from './QRCode'


export const ELEVEN_LABS_KEY: string = "eleven_labs_api_key"
const ELEVEN_LABS_LINK = 'https://beta.elevenlabs.io/subscription'


export const OPENAI_KEY: string = "openai_api_key"
const OPENAPI_LINK= 'https://platform.openai.com/account/api-keys'



interface ApiProps {
    title: string;
    redirectLink: string;
    apiKeyName: string;
  }
  
  export function AddAPIKeys({
    title,
    redirectLink,
    apiKeyName,
  }: ApiProps) {
    


    const [storedValue, setValue] = useLocalStorage<string | null>(apiKeyName, null);
    const [apiKeyValue, setApiKeyValue] = useState(storedValue ?? '');
    const [isDirty, setIsDirty] = useState(false);
    const [isSaved, setIsSaved] = useState(false)

    const changeApiKey = (e: React.ChangeEvent<HTMLInputElement>) => {
      setApiKeyValue(e.target.value);
      setIsDirty(e.target.value !== storedValue);
    };

    const [elevenLabs, setelevenLabs] = useRecoilState(ElevenLabsApiKey);
    const [openAi, setopenAi] = useRecoilState(OpenAIApiKey);

    const saveApiKey = () => {

        if (apiKeyName === OPENAI_KEY ) setopenAi(apiKeyValue)
        if (apiKeyName === ELEVEN_LABS_KEY) setelevenLabs(apiKeyValue)

        setValue(apiKeyValue);

        setIsSaved(true)
        // TEMPORARY TO SOLVE THE ISSUE IMMEDIATELY
        location.reload()
    };

    
    return (
      <ul
        tabIndex={0}
        className="px-4 py-4 dropdown-content bg-white shadow rounded-box flex flex-col w-[358px]"
      >
            <div className="font-bold text-sm text-left">
            Enter {title} API Key
            </div>

            <p className="text-xs">
            Your API Key is stored locally in your browser.
            </p>
            
            <div className="pt-7 space-y-3">
                <Link
                    href={`${redirectLink}`}
                    className="hover:border-b-[1px] pb-1 h-4 hover:border-b-[#71a0ee] cursor-pointer w-fit text-xs flex flex-wrap space-x-1 items-center text-[#71a0ee]"
                >
                    <a target="_blank" rel="noopener noreferrer">
                    Get your API Key from {title}
                    </a>
                    <ArrowUpRightIcon height={14} width={14} color="#71a0ee" />
                </Link>

                <input
                    value={apiKeyValue}
                    onChange={changeApiKey}
                    type="password"
                    className="py-2 tracking-widest text-[#bdbdbd] outline-none px-4 w-full rounded-[11px] bg-[#f5f5f5]"
                />

                {isSaved && ( 
                    <span className="text-green-500 text-xs">API key saved successfully!</span>
                )}

                <button
                    onClick={saveApiKey}
                    className={`${isDirty ? 'bg-[#5d5fef]' : 'bg-[#e0e0e0]'} w-full py-2 rounded-lg items-center flex justify-center text-white font-bold rounded-[11px]'`}
                    disabled={!isDirty}
                >
                    Save
                </button>
            </div>
      </ul>
    );
  }

interface SettingsProps { 
    title: string, 
    savedValue: string | null | undefined,
    component: any
}
function SettingSlot({title, savedValue, component}: SettingsProps) { 
    
    const [openAIToggle, setOpenAiToggle] = useState(false)
    const dropdownRef = useRef(null);

    const openAIDrop = () => {
        setOpenAiToggle(!openAIToggle);
    };
    return (
        <>  
            <div 
                // ref={dropdownRef}
                onClick={openAIDrop} 
                className='dropdown dropdown-right cursor-pointer rounded-[11px] w-[180px] hover:bg-[#F5F5F5] py-3 flex flex-col '>
                <label tabIndex={0} className='text-[#505050] text-[13px] text-left w-full cursor-pointer '>{title}</label>
                { savedValue && <input readOnly={true} type='password' className='outline-none text-xs bg-inherit w-full text-[#BDBDBD] tracking-widest font-light cursor-pointer' value={savedValue}/>}
            </div>  
            
                { openAIToggle && component }

        </>
    )
}

function SettingsToggle() { 
    const [toggle, setToggle] = useState(false)
    const openDrop = () => { setToggle(!toggle) }

    const elevenLabs = useRecoilValue(ElevenLabsApiKey);
    const openAi = useRecoilValue(OpenAIApiKey);

    const [deleted, setDeleted] = useState(false)


    const [elevenLabsState, setelevenLabs] = useRecoilState(ElevenLabsApiKey);
    const [openAiState, setopenAi] = useRecoilState(OpenAIApiKey);

    const deleteAllKeys = () => {
        let res = deleteLocalStorage()
        setDeleted(res)
    }
    useEffect(() => {

        if (deleted) { 
            setelevenLabs(null)
            setopenAi(null)
            location.reload()
        } else if (openAiState || elevenLabsState) { 
            setDeleted(false)
        }
    }, [deleted, elevenLabsState, openAiState])

    return (
        <>  
            <div className='flex flex-col'>
                {/* {toggle && <ShowSettings/> } */}
                <div className='cursor-pointer dropdown dropdown-top' >
                    <label tabIndex={0} className="btn btn-link">
                        <Cog8ToothIcon height={24} width={24} color={`${toggle ? 'black' : '#757575'} `} />
                    </label>
                    <ul tabIndex={0} className="cursor-pointer dropdown-content p-2 mb-5 menu active shadow bg-base-100 rounded-box">
                        <li className='cursor-pointer'>
                            <SettingSlot 
                                savedValue={openAi} 
                                title='Eleven Labs API Key'
                                component={
                                    <AddAPIKeys
                                        redirectLink={ELEVEN_LABS_LINK}
                                        title='Eleven Labs'
                                        apiKeyName={ELEVEN_LABS_KEY}
                                    />
                                }
                            />
                        </li>
                        <li className='cursor-pointer'>
                            <SettingSlot
                                savedValue={elevenLabs}
                                title='OpenAI API Key'
                                component={
                                    <AddAPIKeys
                                        redirectLink={OPENAPI_LINK}
                                        title='OpenAI'
                                        apiKeyName={OPENAI_KEY}
                                    />
                                }
                            />
                        </li>
                        <li className='mt-5'>
                            {   

                                (elevenLabs || openAi) ? (
                                    deleted ? (
                                        <div className='w-full font-bold cursor-pointer text-white bg-green-500 py-3 rounded-[11px] text-xs items-center flex justify-center'>
                                            Keys successfully deleted
                                        </div> 
    
                                    ) : (
                                        <div onClick={deleteAllKeys} className='w-full font-bold cursor-pointer text-white bg-[#FF4545] py-3 rounded-[11px] text-xs items-center flex justify-center'>
                                            Delete Session Data
                                        </div>
                                    )
                                ) : (
                                    <div className='w-full cursor-default font-bold text-gray-600 bg-gray-300 py-3 rounded-[11px] text-xs items-center flex justify-center'>
                                        Enter API Keys 
                                    </div> 
                                    
                                )
                            }
                        </li>
                    </ul>
                </div>
            </div>
        </>

    )
}


function SettingsButtons() {
  return (
    <div className='flex flex-row w-full justify-between items-end '>
        <div className='flex items-center space-x-10'>
            <SettingsToggle />
            <div className='w-[2px] h-4 rounded-full bg-[#9e9e9e]'></div>
            <div className='text-[#757575]  text-left text-sm'>Donate</div>
        </div>
                  
        <div className='w-fit relative bottom-2'>
            <QRCode />
        </div>

    </div>
  )
}

function checkAndCloseDropDown(e: any){
	let targetEl = e.currentTarget;
	if(targetEl && targetEl.matches(':focus')){
		setTimeout(function(){
			targetEl.blur();
		}, 0);
	}
}


export default SettingsButtons

