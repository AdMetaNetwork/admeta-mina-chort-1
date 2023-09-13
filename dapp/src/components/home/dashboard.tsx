import { FC, useContext, useEffect, useState } from 'react'
import BaseTag from "@/components/ui/base-tag";
import ItemSVG1 from "@/components/svg/item1";
import BaseBtn from "@/components/ui/base-btn";
import BaseCtx from "@/utils/context";
import { useRouter } from "next/router";
import { useAccount, useConnect } from 'wagmi'
import * as U from '@/utils'
import { BigNumber } from "ethers";
import { ADMETA_MSG_ACCOUNT } from '@/utils/constant';

const Dashboard: FC = () => {
  const { adMetaAddress, minaAddress } = useContext(BaseCtx)
  const [scoreMap, setScoreMap] = useState({})
  const router = useRouter()
  const { address } = useAccount()

  const step = (index: number, arr: number[]) => {
    console.log(index)
    if (index === 0) {
      return [0, 100]
    }
    let s = parseInt(((arr[index] - arr[index - 1]) / arr[index] * 100) + '')
    let e = 100 - s
    // console.log((arr[index] - arr[index - 1]) / arr[index]  * 100)
    return [s, e]
  }

  useEffect(() => {
    if (address) {
      U.Messager.sendMessageToContent(ADMETA_MSG_ACCOUNT, { account: address, balance: 0 })
    }
  })


  return address && minaAddress
    ?
    <div className={'px-10'}>
      <div className={'text-white my-10 font-semibold text-2xl'}>Dashboard</div>
      <div className={'flex items-center '}>
        <div className={'bg-[#18191D] p-8 rounded-[20px] h-[160px] flex-col mr-10 justify-between'}>
          <div className={'flex items-center'}>
            <ItemSVG1 />
            <div className={'w-2'}></div>
            <div className={'text-white'}>Total earnings</div>
          </div>
          <div className={'flex items-center my-4'}>
            <div className={'text-blue-500 font-semibold text-xl'}>{Math.ceil(Math.random() * 10) / 100}</div>
            <div className={'w-2'}></div>
            <BaseTag label={'ADM'} bg={'#58BD7D'} />
          </div>
          {/*<div className={ 'text-gray-600' }>$18.1</div>*/}
        </div>
        <div className={'bg-[#18191D] p-8 rounded-[20px] h-[160px] flex-col mr-10 justify-between'}>
          <div className={'flex items-center'}>
            <ItemSVG1 />
            <div className={'w-2'}></div>
            <div className={'text-white'}>Completed ad tasks</div>
          </div>
          <div className={'flex items-center my-4'}>
            <div className={'text-blue-500 font-semibold text-xl'}>{Math.ceil(Math.random() * 10)}</div>
          </div>
          <div className={'w-full bg-gray-700 h-0.5'}>
            <div className={'bg-blue-500 w-1/3 h-0.5'}></div>
          </div>
        </div>
        <div className={'bg-[#18191D] p-8 rounded-[20px] h-[160px] flex-col mr-10 justify-between'}>
          <div className={'flex items-center'}>
            <ItemSVG1 />
            <div className={'w-2'}></div>
            <div className={'text-white'}>Earned NFT badges</div>
          </div>
          <div className={'flex items-center my-4'}>
            {
              Object.keys(scoreMap).map((key, index) => (
                U.H.calculationSingleLevel(scoreMap[key])
                  ?
                  <div className={'mr-8'} key={index}>
                    <div className={'w-[40px] h-[40px] bg-orange-400 rounded mb-2'}></div>
                    <div className={'text-white text-xs'}>{key}<br />LV:{U.H.calculationSingleLevel(scoreMap[key])}
                    </div>
                  </div>
                  :
                  <></>
              ))
            }
          </div>
        </div>
      </div>
      <div>
        <div className={'text-white mt-20 mb-10 font-semibold text-2xl'}>Current Single Level</div>
        {
          Object.keys(scoreMap).map((key) => (
            <div className={'flex items-center mb-4'} key={key}>
              <div className={'text-white mr-8 font-semibold w-[200px]'}>{key} Score</div>
              <div className={'text-gray-500 mr-8 w-[50px]'}>{scoreMap[key]}</div>
              <div className={'text-yellow-500 mr-8 w-[50px]'}>Lv.{U.H.calculationSingleLevel(scoreMap[key])}</div>
              <div className={`h-2 w-[60%] bg-gray-700`}>
                <div
                  className={`h-2 bg-blue-500`}
                  style={{ width: `${step(U.H.calculationSingleLevel(scoreMap[key]), U.C.MIN_LEVEL)[0]}%` }}
                ></div>
              </div>
            </div>
          ))
        }
      </div>

      <div className={'flex mt-20 w-full justify-center mb-20'}>
        <BaseBtn
          label={'Mina ZK Verify'}
          bg='bg-orange-500'
          handleClick={async () => {
            const c = new U.CallEVM()
            let score = localStorage.getItem('sync_data')
            let accounts = await window.mina.requestAccounts();
            const { Mina, PublicKey, isReady, PrivateKey, fetchAccount, AccountUpdate, Field } = await import('o1js');
            await isReady;

            console.log('load o1js')
            const Berkeley = Mina.Network(
              'https://proxy.berkeley.minaexplorer.com/graphql'
            );
            Mina.setActiveInstance(Berkeley);

            const deployAdd = localStorage.getItem('deploy_address')
            const { Score } = await import('../../../build_mina/src');

            console.log('contract start compile')
            c.init().then(async () => {
              try {
                const r = await c.getUserLevel(address!)
                console.log(r, '00099')
                const o = JSON.parse(r[3])
                if (!score) {
                  // 0 - 0
                  alert('No Data need verify!')
                } else {
                  const s = JSON.parse(score)
                  
                  console.log('update date--->>', s)
                  const senderAccount = PublicKey.fromBase58(accounts[0])
                  const deployAccount = PublicKey.fromBase58(deployAdd!)
                  console.log('deployAccount--->>', deployAccount.toBase58())
                  console.log('senderAccount--->>', senderAccount.toBase58())
                  const zkAppInstance = new Score(deployAccount);
                  await Score.compile()
                  console.log('contract end compile')
                  const tx = await Mina.transaction({
                    sender: senderAccount,
                    fee: 100_000_000
                  }, () => {
                    fetchAccount({ publicKey: senderAccount.toBase58() })
                    zkAppInstance.updateScore(Field(s.GameFi), Field(s.DeFi), Field(s.Metaverse), Field(s.NFT), Field(s.DID), Field(s.AI))
                  })
                  console.log('trans start')

                  await tx.prove().catch(err => err)

                  let partiesJsonUpdate = tx.toJSON();
                  console.log('sign start')

                  // @ts-ignore
                  let partyResult = await window.mina.sendTransaction({
                    transaction: partiesJsonUpdate,
                    feePayer: {
                      memo: "update score",
                      fee: 0.1
                    },
                  })

                  console.log("signPartyButton==1", partyResult.hash());

                  Object.keys(o).map((key) => {
                    o[key] += s[key]
                  })

                  setScoreMap(o)

                }

              } catch (error) {
                // 0 - 0
                console.log('No Data need verify!')
              }
            })
          }}
        />
        <div className='w-10'></div>
        <BaseBtn
          label={'Update Date To EVM'}
          handleClick={async () => {
            let score = localStorage.getItem('sync_data')
            if (!score) {
              score = JSON.stringify({
                DeFi: 0,
                GameFi: 0,
                NFT: 0,
                Metaverse: 0,
                OnChainData: 0,
                DID: 0,
                AI: 0
              })
            }
            console.log(JSON.parse(score))
            const c = new U.CallEVM()
            setScoreMap(JSON.parse(score))
            try {
              await c.init()
            } catch (err: any) {
              console.log(err.message, 'Error')
            }
            try {
              const r = await c.getUserLevel(address!)
              console.log(r, '00099')
              const o = JSON.parse(r[3])
              if (!score) return
              const s = JSON.parse(score)

              Object.keys(o).map((key) => {
                o[key] += s[key]
              })

              setScoreMap(o)

              const level = BigNumber.from(0)
              const allScore = BigNumber.from(0)
              const categoryScore = JSON.stringify(o)

              c.setUserLevel(level, allScore, categoryScore, address!).then()
              localStorage.removeItem('sync_data')
            } catch (error) {
              const level = BigNumber.from(0)
              const allScore = BigNumber.from(0)
              const categoryScore = score
              console.log(level, allScore, categoryScore)
              c.setUserLevel(level, allScore, categoryScore, address!).then()
            }
          }}
        />
        <div className='w-10'></div>
        <div className='fixed top-0 right-0 opacity-0'>
          <BaseBtn
            label={'Clear data'}
            bg='bg-red-500'
            handleClick={() => {
              const c = new U.CallEVM()
              c.init().then(async () => {
                const r = await c.getUserLevel(address)
                const o = JSON.parse(r[3])
                setScoreMap(o)

                const level = BigNumber.from(0)
                const allScore = BigNumber.from(0)
                const categoryScore = JSON.stringify({
                  DeFi: 0,
                  GameFi: 0,
                  NFT: 0,
                  Metaverse: 0,
                  OnChainData: 0,
                  DID: 0,
                  AI: 0
                })
                console.log(level, allScore, categoryScore)
                c.setUserLevel(level, allScore, categoryScore, address).then()
                U.Messager.sendMessageToContent(U.C.ADMETA_MSG_CLEAR_DID, { address })
                setScoreMap({})
              })
            }}
          />
        </div>
      </div>
    </div>
    :
    <div className={'flex flex-col w-full justify-center items-center w-full h-[90vh]'}>
      <div className={'text-white text-2xl mb-10 font-semibold'}>Before using this module, please connect your
        wallet.
      </div>
      <BaseBtn
        label={'Connect Wallet'}
        handleClick={() => {
          router.push('/connect')
        }}
      />
    </div>
}

export default Dashboard
