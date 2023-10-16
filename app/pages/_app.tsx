import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import useAudioPlayer, { AudioProvider } from '../hooks/useAudioPlayer'
import { AnimatePresence } from 'framer-motion';
import Layout from '../layout/Layout';
import { useEffect } from 'react';
import { UploadProgressProvider } from '../hooks/useUploadProgress';
import AudioPlayerComponent from '../components/player/AudioPlayerComponent';
import { Player } from '../components/AudioMediaPlayer';
import { Toaster } from 'react-hot-toast';
import { Inter } from 'next/font/google'
import { AuthProvider } from '../hooks/useAuth';



// If loading a variable font, you don't need to specify the font weight
const inter = Inter({ subsets: ['latin'] })

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
          <AuthProvider>
      <RecoilRoot>
            <Toaster
              position="top-center"
              reverseOrder={false}
            />
            <AudioProvider>
              <UploadProgressProvider>
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
                  <main className={inter.className}>
                    <Layout>
                          <Component {...pageProps} key={router.route} />
                    </Layout>
                  </main>
                </AnimatePresence>

              <AudioPlayerComponent />
              </UploadProgressProvider>
            </AudioProvider>
      </RecoilRoot>
          </AuthProvider>
  )
}

export default MyApp
