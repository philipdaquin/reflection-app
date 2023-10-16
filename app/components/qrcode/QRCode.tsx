import React, { useState } from 'react'
import QRmodal from './components/QRmodal'
import QRButton from './components/QRButton'

function QRCode() {
      
    const [toggleModal, setToggleModal] = useState(false)

    const openModal = () => setToggleModal(!toggleModal)


    return (
        <div className='dropdown dropdown-top dropdown-end '>
            <ul tabIndex={0} className="dropdown-content z-[1] menu relative mb-5">
                <li><QRmodal /></li>
            </ul>
            <label tabIndex={0} className="cursor-pointer ">
                <QRButton />
            </label>
        </div>
    )
}

export default QRCode