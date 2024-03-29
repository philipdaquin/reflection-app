// import React, { useState, useEffect } from 'react';
// export default ModalView
import MuiModal from '@mui/material/Modal'
import React, { useState, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { AddEntryToggle, ModalState, ShowAudioPlayer } from '../../atoms/atoms';
import { AnimatePresence, motion } from "framer-motion";
import useUploadContext from '../../hooks/useUploadProgress';

interface Props { 
  children: any
}

function ModalView({children}: Props) {
    const [showModal, setShowModal] = useRecoilState(AddEntryToggle);
    const [showPlayer, setshowAudioPlayer] = useRecoilState(ShowAudioPlayer)
    const [isOpen, setIsOpen] = useState(false)


    useEffect(() => {
      setIsOpen(showModal || showPlayer)
      setTranslateY(isOpen ? ' translate-y-0' : '');
    }, [showModal, showPlayer, isOpen])
    const [translateY, setTranslateY] = useState(isOpen ? 'translate-y-0' : '');

    const handleClose = () => { 
      if (showPlayer || showModal) {
        setShowModal(false);
        setshowAudioPlayer(false)
      }
    }


      //
      //duration-700 ease-in-out transition-all
      return (
          <MuiModal
            className={`
              fixed left-0 right-0 h-full 
              z-50 mx-auto w-full max-w-2xl
              overflow-hidden overflow-y-scroll 
              rounded-md rounded-b-none scrollbar-hide
              duration-700 ease-out transition-all 
            `}
            open={isOpen}
            onClose={handleClose}
          > 
          <>
            <motion.div
             initial={{ opacity: 0 }}
             animate={{
               opacity: 1,
               transition: { duration: 0.4, ease: [0.36, 0.66, 0.04, 1] },
             }}
             exit={{
               opacity: 0,
               transition: { duration: 0.3, ease: [0.36, 0.66, 0.04, 1] },
             }}
             
            />
              {children}
          </>
          
          </MuiModal>
      );
}

export default ModalView