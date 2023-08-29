import { ethers, BigNumber } from 'ethers'
import detectEthereumProvider from "@metamask/detect-provider";
import * as U from './'
import axios from 'axios'

class CallEVM {
  private signer: ethers.providers.JsonRpcSigner | undefined
  contract: ethers.Contract | undefined

  constructor() {}

  async init() {
    const p = await detectEthereumProvider()
    const provider = new ethers.providers.Web3Provider(p!)
    this.signer = provider.getSigner()
    const r = await axios.post(`${U.C.HTTP_SERVER}admeta/getContractVersion`)
    const contractAddress = r.data.address
    const abi = r.data.abi
    const c = new ethers.Contract(contractAddress, abi, this.signer);
    this.contract = c.connect(this.signer)
  }

  async setUserLevel(level: BigNumber, score: BigNumber, categoryScore: string, address: string) {
    return await this.contract?.setUserLevel(level, score, categoryScore, address)
  }

  async getUserLevel(address: string) {
    return await this.contract?.getUserLevel(address)
  }

}

export default CallEVM
