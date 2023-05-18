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
        <Layout>
          <AudioProvider>
              <Component {...pageProps} key={router.route} />
          </AudioProvider>
        </Layout>
        {/* </AuthProvider> */}
      </RecoilRoot>
  )
}

export default MyApp
