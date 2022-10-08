import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ThirdwebProvider } from '@thirdweb-dev/react'
import { ChainId } from '@thirdweb-dev/sdk'

function MyApp({ Component, pageProps }: AppProps) {
  return (  
    <ThirdwebProvider desiredChainId={ChainId.Rinkeby}>
      <Component {...pageProps} />
    </ThirdwebProvider>
  )
}

export default MyApp
