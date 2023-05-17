import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import { AudioProvider } from '../hooks/useAudioPlayer'

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <RecoilRoot>
        {/* <AuthProvider> */}
        <AudioProvider>
          <Component {...pageProps} />
        </AudioProvider>
        {/* </AuthProvider> */}
      </RecoilRoot>
  )
}

export default MyApp
