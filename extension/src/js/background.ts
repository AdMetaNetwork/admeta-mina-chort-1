import browser from 'webextension-polyfill'
import { Account, Domain, ExtStatus, ScanDomain, DataConfig, Domains } from "../util/types";
import Messenger from "../util/messenger";
import { ADMETA_MSG_ACCOUNT, ADMETA_MSG_AD_PUSH, ADMETA_MSG_DOMAIN, ADMETA_MSG_SWITCH, DOMAIN_CONFIG_URL, ADMETA_MSG_NFT_PUSH, NFT_RECOMMOND, ADMETA_MSG_NFT_CLAIM, TEST_ACCOUNT, RPC, REPORTING_TIME, OPEN_TAB_NUMBER, ADMETA_MSG_CLEAR_DID } from '../util/constant'
import Helper from '../util/helper';
import { BigNumber, ethers } from 'ethers'
import WHITE_LIST from '../util/white-list';

class Background {

  // domain config
  private config: DataConfig | undefined;
  // uesr account
  private account: Account | undefined;
  // user setting domains
  private domain: Domain | undefined;
  // user setting ext switch
  private extStatus: boolean = true;

  // scan_list
  private scanList: ScanDomain[] = []

  // ad list
  private advertisements: Record<string, any>[] = []

  // domain white list
  private whiteList: Domains[] = WHITE_LIST.products

  // contract
  private contract: ethers.Contract | undefined

  constructor() { }

  initScore() {
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
  }

  initEVM() {
    const provider = new ethers.providers.JsonRpcProvider(RPC);
    // test call wallet
    Helper.apiCall({
      URI: `admeta/getContractVersion`,
      full_url: false,
      method: 'POST',
      params: {}
    }).then((v) => {
      v.json().then((r) => {
        console.log(r)
        const w = ethers.Wallet.fromMnemonic(TEST_ACCOUNT);
        const p = w.privateKey;
        const wallet = new ethers.Wallet(p, provider);
        const c = new ethers.Contract(r.address, r.abi, wallet);
        this.contract = c.connect(wallet)
      })
    })
  }

  listenInstall() {
    browser.runtime.onInstalled.addListener((message) => {
      if (message.reason === 'install') {
        this.initScore()
      }
    })
  }

  listenForMessages() {
    browser.runtime.onMessage.addListener((message, sender) => {
      const { type, data } = message;
      if (type === ADMETA_MSG_ACCOUNT) {
        const tabId = sender.tab?.id
        console.log(tabId, '1233-->>>')
        browser.storage.local.set({ tabId }).then()
      }
      this.handleDealMessages(type, data)
    });
  }

  handleDealMessages(type: string, data: any) {
    switch (type) {
      case ADMETA_MSG_ACCOUNT:
        this.saveAccount(data)
        break;

      case ADMETA_MSG_DOMAIN:
        this.saveDomain(data)
        break;

      case ADMETA_MSG_SWITCH:
        this.saveSwitchExt(data)
        break;

      case ADMETA_MSG_CLEAR_DID:
        browser.storage.local.remove('isdid')
        break;

      default:
        break;
    }
  }

  saveAccount(data: any) {
    browser.storage.local.set({ address: data.address, balance: data.balance })
    this.account = data
  }

  saveDomain(data: Domain) {
    browser.storage.local.set({ domain: data.domain })
    this.domain = data
  }

  saveSwitchExt(data: ExtStatus) {
    browser.storage.local.set({ ext_status: data.extStatus })
    this.extStatus = data.extStatus
  }

  saveScanDomain(domain: string) {
    console.log(domain, 'domain')
    if (!domain) {
      return
    }
    const now = new Date().getTime() / 1000
    let time = parseInt(now + '')
    let scanDomain: ScanDomain[] = this.scanList;
    scanDomain.push({
      time,
      domain
    })
    console.log(scanDomain)
    this.scanList = scanDomain;
  }

  getConfig() {
    const that = this;
    Helper.apiCall({
      URI: DOMAIN_CONFIG_URL,
      method: 'GET',
      full_url: true,
    }).then((v) => {
      v.json().then((c) => {
        that.config = c;
      })
    })
  }

  updateScanDomain() {
    const list = this.scanList
    const config = this.config
    if (list.length >= 2) {
      let prevT = list[list.length - 2].time
      let prevD = list[list.length - 2].domain
      let currT = list[list.length - 1].time
      let name = ''
      let category: string[] = []
      config?.products.forEach((item: any) => {
        if (prevD === item.domain) {
          name = item.name
          category = item.category
        }
      })
      if (currT - prevT >= 10) {
        Helper.apiCall({
          URI: `admeta/updateUserWeb3UsingInfo`,
          method: 'POST',
          params: {
            walletAddress: this.account?.account,
            name,
            domain: prevD,
            usingDuration: currT - prevT,
            accessCount: 100,
            category,
            usageMethod: "domain"
          }
        })
      }
    }
  }

  splitUrl(url: string) {
    if (url === '') {
      return
    }
    const { hostname } = new URL(url)
    if (!this.domain?.domain.includes(hostname)) {
      return
    }
    return hostname
  }

  getAdvertisements() {
    Helper.apiCall({
      URI: `admeta/getAdvertisements`,
      method: 'POST'
    }).then((v) => {
      v.json().then((c) => {
        this.advertisements.push(c[c.length - 1])
        this.advertisements.push(c[c.length - 2])
      })
    })
  }

  private reportBroswer(tab: any) {
    if (!this.whiteList.length) {
      return
    }
    const isIn = Helper.isInWhiteList(this.whiteList, tab.url || '-1')
    if (isIn) {
      const idx = Helper.currentDomainIdx(this.whiteList, tab.url || '-1')
      const timer = setTimeout(async () => {
        clearTimeout(timer)

        console.log('report', idx, this.whiteList[idx].category)
        const categorys = this.whiteList[idx].category
        if (categorys.includes('DID')) {
          browser.storage.local.set({ isdid: 'yes' })
        }
        const { score } = await browser.storage.local.get(['score'])
        categorys.forEach((item: any) => {
          score[item] += 50
        })

        console.log(categorys, score)
        await browser.storage.local.set({ score: { ...score } })
      }, REPORTING_TIME)
    }
  }


  listenTabChange() {
    browser.tabs.onActivated.addListener((l) => {
      browser.tabs
        .query({ active: true, currentWindow: true })
        .then((activeTab) => {
          console.log(activeTab, this.extStatus)
          if (this.extStatus) {
            this.reportBroswer(activeTab[0])
          }
        });
    });
  }

  getBroswerSearch(url: string) {
    // Google Bing Duckduckgo
    if (url.includes('google') || url.includes('bing') || url.includes('duckduckgo')) {
      return Helper.getQueryVariable('q', url)
    }

    // Baidu
    if (url.includes('baidu')) {
      return Helper.getQueryVariable('wd', url)
    }

    return ''
  }

  async searchKeyWordAd(tabId: number, tab: browser.Tabs.Tab) {
    const { account, isdid } = await browser.storage.local.get(['account', 'isdid'])
    const q = this.getBroswerSearch(tab.url || '')
    if (q === 'admeta') {
      Messenger.sendMessageToContentScript(
        tabId,
        ADMETA_MSG_AD_PUSH,
        { message: this.advertisements[0], address: account }
      );
    }
    if (q === 'nansen' || q === 'web3go') {
      Messenger.sendMessageToContentScript(
        tabId,
        ADMETA_MSG_AD_PUSH,
        { message: this.advertisements[1], address: account }
      );
    }
    if (q === 'did' || q === 'litentry') {
      this.callEVM(tabId, 4)
    }
    if (q === 'ai' || q === 'web3go') {
      this.callEVM(tabId, 5)
    }
    if (q === 'nft' || q === 'opensea') {
      Messenger.sendMessageToContentScript(
        tabId,
        ADMETA_MSG_NFT_PUSH,
        { message: NFT_RECOMMOND, address: account }
      );
    }
    if (tab.url?.includes('opensea.io')) {
      Messenger.sendMessageToContentScript(
        tabId,
        ADMETA_MSG_NFT_CLAIM,
        { message: {}, address: account }
      );
    }
  }

  async getTabLength(tab: browser.Tabs.Tab) {
    browser.tabs.query({}).then((tabs) => {
      console.log('tabs00----->>>>', tabs, tabs.length)
      // default length is 8
      if (tabs.length > OPEN_TAB_NUMBER && tab.id && tab.url && !tab.url.includes('chrome://')) {
        this.pushAd(tab.id)
      }
    })
  }

  listenTabUpdate() {
    browser.tabs.onUpdated.addListener(
      async (tabId, changeInfo, tab) => {
        if (changeInfo.status === 'complete') {
          this.searchKeyWordAd(tabId, tab)
          this.reportBroswer(tab)
          // this.getTabLength(tab)
        }
      }
    );
  }

  async pushAd(tabId: number) {
    const { pushDate, account } = await browser.storage.local.get(['pushDate', 'account'])
    console.log(pushDate, 'pushDate-->>')
    const d = Helper.currentDate()
    if (pushDate === d) {
      return
    }
    // this.callEVM(tabId)
  }

  async callEVM(tabId: number, tag: number) {
    const { address } = await browser.storage.local.get(['address'])
    console.log(address)
    // get user tag score
    const useScore = await this.contract?.getUserLevel(address)
    console.log(JSON.parse(useScore.categoryScores))
    const obj = JSON.parse(useScore.categoryScores)

    if (tag === 4) {
      if (obj.DID < 100) {
        return
      }
    }

    if (tag === 5) {
      if (obj.AI < 100) {
        return
      }
    }

    const matchIndex = await this.contract?.matchAd(BigNumber.from(tag), address)
    console.log(matchIndex)

    this.contract?.adInfo(matchIndex).then((b: any) => {
      const message = {
        callbackLink: b[6],
        metadata: b[4],
        id: b[0].toNumber(),
        address: b[1]
      }
      Messenger.sendMessageToContentScript(
        tabId,
        ADMETA_MSG_AD_PUSH,
        { message, address }
      );
      browser.storage.local.set({ pushDate: Helper.currentDate() })
    })
  }

  init() {
    // Listen install
    this.listenInstall()
    // Listen for messages from background and run the listener from the map
    this.listenForMessages();

    // Listen for tab change
    this.listenTabChange();

    // Listen for tab update
    this.listenTabUpdate();

    // Get domain config
    this.getConfig()

    // Get getAdvertisements
    this.getAdvertisements()

    // init evm
    this.initEVM()
  }

}
new Background().init();