import React from 'react'
import { motion } from 'framer-motion';
import { Player } from '../AudioMediaPlayer';

interface Props { 
  children: React.ReactNode
}

function Layout({children}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Player />
      {children}
    </motion.div>
  )
}

export default Layout