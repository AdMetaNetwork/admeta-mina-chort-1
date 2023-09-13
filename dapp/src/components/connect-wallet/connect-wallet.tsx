import { FC, useContext, useEffect, useState } from 'react'
import BaseBtn from "@/components/ui/base-btn";
import BaseCtx from "@/utils/context";
import * as U from '@/utils'
import { useRouter } from "next/router";
import { useAccount, useConnect, useNetwork } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { ChainIcon, ConnectKitButton, useModal } from 'connectkit';
import { sepolia } from 'wagmi/chains'
// import {Mina, PublicKey, isReady, PrivateKey, fetchAccount, AccountUpdate } from 'o1js'


const ConnectWallet: FC = () => {
  const { adMetaAddress, setAdMetaAddress, minaAddress, setMinaAddress } = useContext(BaseCtx)
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  const network = useNetwork()
  const { setOpen } = useModal()

  const [deployAddress, setDeployAddress] = useState('')
  const [deployKey, setDeployKey] = useState('')

  useEffect(() => {
    if (network.chain?.id === sepolia.id) {
      setOpen(false)
    }
  }, [network.chain?.id, setOpen])

  return (
    <div className={'px-10'}>
      <div className={'text-white font-semibold text-xl mt-4 mb-10'}>Welcome, First, please connect your Mina Auro
        wallet and Metamask wallet,
        <br />if you don&apos;t have one you can create one, here is link to install.
      </div>
      <div className={'flex items-center mb-20'}>
        <BaseBtn
          label={'Install auro extension and create a account'}
          handleClick={() => {
            window.open('https://www.aurowallet.com/')

          }}
        />
        <div className={'w-2'}></div>
        <BaseBtn
          label={'Install Metamask extension and create a account'}
          handleClick={() => {
            window.open('https://metamask.io/download/')
          }}
        />
      </div>
      <div>
        <div className={'text-white font-semibold text-xl mt-4 mb-10'}>Connect wallet</div>
        <div className={'flex items-center mb-20'}>
          {
            address
              ?
              <div className={'text-yellow-500 font-semibold'}>AdMetaWallt: {address}</div>
              :
              <ConnectKitButton.Custom >
                {({ show }) => {
                  return (
                    <BaseBtn
                      label='Connect MetaMask'
                      handleClick={() => show!()}
                    />
                  );
                }}
              </ConnectKitButton.Custom>
          }
          <div className={'w-2'}></div>
          {
            minaAddress
              ?
              <div className={'text-blue-500 font-semibold'}>MinaWallt: {minaAddress}</div>
              :
              <BaseBtn
                label={'Connect Mina'}
                handleClick={() => {
                  U.Messager.sendMessageToContent(U.C.ADMETA_MSG_ACCOUNT, { address })
                  U.H.connectMinaWallet((address) => {
                    setMinaAddress!(address[0])
                    // if (isConnected && address) {
                    //   router.push('/')
                    // }
                  })
                }}
              />
          }
          <div className='ml-2'>
            {
              deployAddress
                ?
                <div className={'text-red-500 font-semibold'}>Mina Deploy Address: {deployAddress}</div>
                :
                <BaseBtn
                  label={'Generate Mina Deploy Address'}
                  handleClick={async () => {
                    const { Mina, PublicKey, isReady, PrivateKey, fetchAccount, AccountUpdate } = await import('o1js');
                    await isReady;
                    const zkAppPrivateKey = PrivateKey.random();
                    const zkAppAddress = zkAppPrivateKey.toPublicKey();
                    localStorage.setItem('deploy_address', zkAppAddress.toBase58())
                    localStorage.setItem('deploy_address2', zkAppPrivateKey.toBase58())

                    setDeployAddress(zkAppAddress.toBase58())
                    setDeployKey(zkAppPrivateKey.toBase58())
                  }}
                />
            }

          </div>

          <div className='ml-2'>
            <BaseBtn
              label={'Get Token From Faucet'}
              handleClick={async () => {
                window.open(`https://faucet.minaprotocol.com/?address=${deployAddress}&?explorer=minaexplorer`)
              }}
            />

          </div>
          <div onClick={() => {
            console.log(deployKey)
          }}>hhh</div>
          <div className='ml-2'>
            <BaseBtn
              label={'Deploy Contract For Mina'}
              handleClick={async () => {
                // let accounts = await window.mina.requestAccounts();
                // console.log(accounts)
                const { Mina, PublicKey, isReady, PrivateKey, fetchAccount, AccountUpdate } = await import('o1js');
                await isReady;
                const Berkeley = Mina.Network(
                  'https://proxy.berkeley.minaexplorer.com/graphql'
                );
                Mina.setActiveInstance(Berkeley);

                try {
                  const d = await fetchAccount({ publicKey: PublicKey.fromBase58(deployAddress) })

                  console.log('sss--<<<', d)

                  if (d.account?.zkapp) {
                    alert('A contract has already been deployed at this address')
                    router.push('/')
                    return
                  }
                } catch (error) {
                  console.log(error)
                  alert('Please try again later')
                }

                const { Score } = await import('../../../build_mina/src');

                console.log('load o1js ok!')

                const senderAccount = PublicKey.fromBase58(deployAddress)

                const zkAppInstance = new Score(senderAccount);
                const { verificationKey } = await Score.compile()

                console.log('start deploy sign!')
                const deployTxn = await Mina.transaction({
                  sender: senderAccount,
                  fee: 100_000_000
                }, () => {
                  fetchAccount({ publicKey: senderAccount });
                  zkAppInstance.deploy({ verificationKey });
                });
                console.log('start deploy send!')

                await deployTxn.prove().catch(err => err)
                let partyResult = await deployTxn.sign([PrivateKey.fromBase58(deployKey)]).send();
                

                console.log("signPartyButton==1", partyResult.hash());
                alert(`send hash is ${partyResult.hash()}`)
              }}
            />
          </div>
          <div className='ml-2' onClick={() => {
            console.log(deployKey)
          }}>
            <BaseBtn
              label={'Go Dashboard'}
              handleClick={async () => {
                router.push('/')
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConnectWallet
