// import React, { useState, useEffect } from 'react';


// interface Props { 
//     isOpen: boolean, 
//     children: any,
//     onClose: any
// }

// function ModalView({isOpen, children, onClose}: Props) {
//     const [opacity, setOpacity] = useState(isOpen ? 'opacity-100' : 'opacity-0');
//     const [pointerEvents, setPointerEvents] = useState(isOpen ? 'pointer-events-auto' : 'pointer-events-none');
//     const [translateY, setTranslateY] = useState(isOpen ? 'translate-y-0' : 'translate-y-full');
    
//     useEffect(() => {
//         setOpacity(isOpen ? 'opacity-100' : 'opacity-0');
//         setPointerEvents(isOpen ? 'pointer-events-auto' : 'pointer-events-none');
//         setTranslateY(isOpen ? 'translate-y-0' : 'translate-y-full');
//       }, [isOpen]);
    
//       const closeModal = () => {
//         setOpacity('opacity-0');
//         setPointerEvents('pointer-events-none');
//         setTranslateY('translate-y-full');
//         onClose();
//       };
    
//       return (
//         <div
//           className={`fixed w-full h-full top-0 left-0 flex items-center justify-center ${opacity} ${pointerEvents} transition-opacity transition-transform duration-300`}
//           onClick={closeModal}
//         >
//           <div className="absolute w-full h-full bg-gray-900 opacity-50"></div>
//           <div className={`bg-white rounded-t-lg w-full sm:w-1/2 md:w-1/3 transform ${translateY} transition-transform duration-300`}>
//             {children}
//           </div>
//         </div>
//       );
// }

// export default ModalView
import MuiModal from '@mui/material/Modal'
import React, { useState, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { AddEntryToggle, ShowAudioPlayer } from '../atoms/atoms';

interface Props { 
  children: any
}

function ModalView({children}: Props) {
    const [showModal, setShowModal] = useRecoilState(AddEntryToggle);
    const [showPlayer, setshowAudioPlayer] = useRecoilState(ShowAudioPlayer)

    const handleClose = () => { 
      if (showPlayer || showModal) {
        setShowModal(false);
        setshowAudioPlayer(false)
      }
    }
      return (
        <MuiModal
          className="
          fixes !top-10 left-0 right-0 
          z-50 mx-auto w-full max-w-5xl 
          overflow-hidden overflow-y-scroll 
          rounded-md scrollbar-hide
          transition duration-500 ease-in-out
          "
          open={showModal || showPlayer}
          onClose={handleClose}
        > 
        <>
          {children}
        </>
          
        </MuiModal>
      );
}

export default ModalView