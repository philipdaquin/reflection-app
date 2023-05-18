import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import { AudioProvider } from '../hooks/useAudioPlayer'
import { AnimatePresence } from 'framer-motion';
import Layout from '../components/layout/Layout';

/* 
  The AudioProvider ensures that the audio can be controlled and accessed from 
  any page or component within the application 
*/
function MyApp({ Component, pageProps, router }: AppProps) {
  return (
      <RecoilRoot>
        {/* <AuthProvider> */}
        <AnimatePresence
            // Disable any initial animations on children that
            // are present when the component is first rendered
            initial={false}
            // Only render one component at a time.
            // The exiting component will finish its exit
            // animation before entering component is rendered
            mode={'sync'}
            // Fires when all exiting nodes have completed animating out
            onExitComplete={() => null}
        >
          <Layout>
            <AudioProvider>
                <Component {...pageProps} key={router.route} />
            </AudioProvider>
          </Layout>
        </AnimatePresence>
        {/* </AuthProvider> */}
      </RecoilRoot>
  )
}

export default MyApp
