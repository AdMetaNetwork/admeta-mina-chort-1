import { FC, useContext, useState, useEffect } from "react";
import Account from "./account";
import BaseButton from "../ui/base-button";
import Records from "./records";
import * as U from '../../util'
import browser from "webextension-polyfill";

const Dashboard: FC = () => {
  const { showOption } = useContext(U.BaseCtx)
  const [address, setAddress] = useState('')

  useEffect(() => {
    browser.storage.local.get(['address']).then(({ address }) => {
      setAddress(address)
    });
  }, [])

  return (
    <div className="w-full pl-4 pr-4">
      {
        address
          ?
          <>
            <Account address={address} />
            <Records />
            <div className={'mb-20 flex justify-center'}>
              <BaseButton label={'Sync Data'} handleClick={async () => {
                const { tabId } = await U.Helper.getOriginInfo()
                if (!tabId) return
                const { score } = await browser.storage.local.get(['score'])
                if (JSON.stringify(score) === JSON.stringify({
                  AI: 0,
                  DID: 0,
                  DeFi: 0,
                  GameFi: 0,
                  Metaverse: 0,
                  NFT: 0,
                  OnChainData: 0
                })) {
                  return
                }
                U.Messenger.sendMessageToContentScript(tabId, U.C.ADMETA_MSG_HACKATHON_SYNC_TO, score)
                browser.storage.local.set({
                  score: {
                    DeFi: 0,
                    GameFi: 0,
                    NFT: 0,
                    Metaverse: 0,
                    OnChainData: 0,
                    AI: 0,
                    DID: 0,
                  }
                })
              }} />
            </div>
          </>
          :
          <div className={'my-20 flex flex-col items-center'}>
            <div className={'text-white font-bold mb-4 text-2xl'}>First, Please connect wallet!</div>
            <BaseButton label={'Connect Wallet'} handleClick={async () => {
              U.Helper.checkOriginIsExist()
              const { tabId } = await U.Helper.getOriginInfo()
              await U.Messenger.sendMessageToContentScript(tabId!, U.C.ADMETA_MSG_EXTENISON_CALL_ADDRESS)
              const timer = setTimeout(() => {
                browser.storage.local.get(['address']).then(({ address }) => {
                  setAddress(address)
                  clearTimeout(timer)
                });
              }, 500)
            }} />
          </div>
      }

    </div>
  )
}

export default Dashboard;
