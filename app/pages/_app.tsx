import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import useAudioPlayer, { AudioProvider } from '../hooks/useAudioPlayer'
import { AnimatePresence } from 'framer-motion';
import Layout from '../components/layout/Layout';
import { useEffect } from 'react';

/* 
  The AudioProvider ensures that the audio can be controlled and accessed from 
  any page or component within the application 
*/
function MyApp({ Component, pageProps, router }: AppProps) {

  const  {playerRef, isPlaying} =useAudioPlayer()

  useEffect(() => {
    if (!playerRef) return 

    

  }, [playerRef, isPlaying])
  

  return (
      <RecoilRoot>
          {/* <AuthProvider> */}
        <AudioProvider>
          <AnimatePresence
              // // Disable any initial animations on children that
              // // are present when the component is first rendered
              // initial={true}
              // // Only render one component at a time.
              // // The exiting component will finish its exit
              // // animation before entering component is rendered
              // mode={'wait'}
              // // Fires when all exiting nodes have completed animating out
              // onExitComplete={() => null}
          >
            <Layout>
                  <Component {...pageProps} key={router.route} />
            </Layout>
          </AnimatePresence>
        {/* </AuthProvider> */}
        </AudioProvider>
      </RecoilRoot>
  )
}

export default MyApp
