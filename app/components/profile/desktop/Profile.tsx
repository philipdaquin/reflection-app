import React from 'react'
import ProfileModal from './components/ProfileModal'
import ProfileButton from './components/ProfileButton'

function Profile() {
  return (
    <div className='dropdown dropdown-top'>
        <ul tabIndex={0} className="dropdown-content z-[1] menu relative mb-5">
            <li><ProfileModal /></li>
        </ul>
        <label tabIndex={0} className="cursor-pointer ">
            <ProfileButton />
        </label>
    </div>
  )
}

export default Profile