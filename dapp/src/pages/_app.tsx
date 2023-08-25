import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import BaseCtx from "@/utils/context";
import { useState } from "react";
import { WagmiConfig, createConfig } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { ConnectKitProvider, getDefaultConfig } from 'connectkit'


const config = createConfig(
  getDefaultConfig({
    appName: 'AdMeta App',
    chains: [sepolia],
    walletConnectProjectId: process.env.PUBLIC_WALLETCONNECT_PROJECT_ID || '',
  })
);


export default function App({ Component, pageProps }: AppProps) {
  const [minaAddress, setMinaAddress] = useState('')
  const [adMetaAddress, setAdMetaAddress] = useState('')

  return (
    <WagmiConfig config={config}>
      <ConnectKitProvider>
        <BaseCtx.Provider value={{ minaAddress, setMinaAddress, adMetaAddress, setAdMetaAddress }}>
          <Component {...pageProps} />
        </BaseCtx.Provider>
      </ConnectKitProvider>
    </WagmiConfig>
  )
}
