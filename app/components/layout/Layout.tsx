import React from 'react'
import { motion } from 'framer-motion';
import { Player } from '../AudioMediaPlayer';

interface Props { 
  children: React.ReactNode
}

function Layout({children}: Props) {
  return (
    <div
      
    >
      <Player />
      {children}
    </div>
  )
}

export default Layout