import browser from 'webextension-polyfill'
import Messenger from "../util/messenger";
import { ADMETA_MSG_AD_PUSH, ADMETA_MSG_NFT_PUSH, ADMETA_MSG_NFT_CLAIM, ADMETA_MSG_HACKATHON_SYNC_TO, ADMETA_MSG_EXTENISON_CALL_ADDRESS, ADMETA_MSG_ACCOUNT } from '../util/constant'
import { pushAdCard, pushNftCard, pushClaimCard } from './ui'
import Helper from '../util/helper';
class ContentScript {

  listenForMessages() {
    browser.runtime.onMessage.addListener((message, sender) => {
      const { type, data } = message;
      this.handleDealMessages(type, data)
    });
  }

  getNftHold() {
    const address = localStorage.getItem('ajs_user_id')!.replace(/\"/g, "");
    const pathname = location.pathname
    const p = pathname.split('/')
    console.log(p[p.length - 1], p[p.length - 2])
    const contractaddress = p[p.length - 2]
    const tokenID = p[p.length - 1]
    if (contractaddress && !contractaddress.includes('0x')) {
      return
    }
    Helper.apiCall({
      URI: `https://api.etherscan.io/api`,
      full_url: true,
      method: 'GET',
      params: {
        module: 'account',
        action: 'tokennfttx',
        contractaddress: '0xe361f10965542ee57d39043c9c3972b77841f581',
        apikey: '3S92QDIPUN5FYSNGYKB26USKKVQZ23N764',
        address: address,
        page: '1',
        offset: '10'
      }
    }).then((v) => {
      v.json().then((c) => {
        const isHold = c.result.some((v: any) => { return v.tokenID === tokenID })
        if (isHold) {
          pushClaimCard()
        }
      })
    })
  }

  handleDealMessages(type: string, data: any) {
    switch (type) {
      case ADMETA_MSG_AD_PUSH:
        pushAdCard(data.message.callbackLink.includes('youtube') ? 'VIDEO' : 'PICTURE', data.message.callbackLink, data.message.metadata, data.message.id, data.address)
        break;
      case ADMETA_MSG_NFT_PUSH:
        pushNftCard()
        break;

      case ADMETA_MSG_NFT_CLAIM:
        this.getNftHold();
        break;
      case ADMETA_MSG_HACKATHON_SYNC_TO:
        this.syncStorageMessages(data);
        break;
      case ADMETA_MSG_EXTENISON_CALL_ADDRESS:

        const storage = localStorage.getItem('wagmi.store')
        if (!storage) return
        const obj = JSON.parse(storage)
        const account = obj.state.data.account
        Messenger.sendMessageToBackground(ADMETA_MSG_ACCOUNT, { address: account, balance: 0 })
        break;

      default:
        break;
    }
  }

  syncStorageMessages(message: any) {
    const l = localStorage.getItem('sync_data')
    console.log(l)
    console.log(message)
    if (l) {
      const d = JSON.stringify({ ...JSON.parse(l), ...message })
      localStorage.setItem('sync_data', d)
    } else {
      localStorage.setItem('sync_data', JSON.stringify(message))
    }
  }

  listenWebPageMessages() {
    window.addEventListener("message", async function (msg) {
      Messenger.sendMessageToBackground(msg.data.type, msg.data.data)
    })
  }

  listenWebComplete() {
    const url = location.href
    if (!url.includes('litentry')) return
    // complete dom
    document.addEventListener('DOMContentLoaded', () => {
      const subBtn = document.querySelector('.button-outline-infrstructure')
      subBtn?.addEventListener("click", function (event) {
        // 这里可以添加你的其他逻辑
        const timer = setTimeout(() => {
          // @ts-ignore
          const success = document.querySelector('.success-message').style.display || ''
          if (success && success === 'block') {
            const address = Helper.getUrlParameter('address')
            const platform = Helper.getUrlParameter('platform')
            Helper.apiCall({
              URI: `admeta/overwriteCompletedRecord`,
              full_url: false,
              method: 'POST',
              params: {
                address,
                platform
              }
            }).then((v) => {
              console.log(v)
            })
            clearTimeout(timer)
          }
        }, 5000)
      });
    })

  }

  init() {
    // Listen for messages from background and run the listener from the map
    this.listenForMessages();

    // Listen for messages from web page
    this.listenWebPageMessages();

    // Listen web click
    this.listenWebComplete()
  }

}

new ContentScript().init()