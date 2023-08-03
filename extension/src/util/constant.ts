export const API = 'https://api.admeta.network/'

export const ADMETA_MSG_ACCOUNT = 'ADMETA_MSG_ACCOUNT'
export const ADMETA_MSG_AD_PUSH = 'ADMETA_MSG_AD_PUSH'
export const ADMETA_MSG_DOMAIN = 'ADMETA_MSG_DOMAIN'
export const ADMETA_MSG_SWITCH = 'ADMETA_MSG_SWITCH'
export const ADMETA_MSG_NFT_PUSH = 'ADMETA_MSG_NFT_PUSH'
export const ADMETA_MSG_NFT_CLAIM = 'ADMETA_MSG_NFT_CLAIM'
export const ADMETA_MSG_EVM = 'ADMETA_MSG_EVM'
export const ADMETA_MSG_HACKATHON_SYNC_TO = 'ADMETA_MSG_HACKATHON_SYNC_TO'
export const WEP_PAGE = 'http://localhost:3000/'
// export const WEP_PAGE = 'https://hackathon.mina.admeta.network/'
export const DOMAIN_CONFIG_URL = 'https://raw.githubusercontent.com/AdMetaNetwork/web3-product-categorized-list/main/web3-product-list.json'

// export const LINK_HTTP = 'http://localhost:3000/'
export const LINK_HTTP = 'https://app.admeta.network/'

export const TEST_ACCOUNT = 'frozen captain slender cat multiply small okay cruise stone virus aim learn'
export const CONTRACT_ADDRESS = '0xd112476CA74aAa81D4B4cB1921423260dff57aF2'
export const RPC = 'https://sepolia.gateway.tenderly.co'
// browser 2 minutes report
export const REPORTING_TIME = 1000 * 10
// open tabs number
export const OPEN_TAB_NUMBER = 7

export const NFT_RECOMMOND = [
  {
    icon: 'https://i.seadn.io/gcs/files/8b2f89f94a33ffe2a12bac420e953c16.png?auto=format&w=384',
    name: 'soulda16club',
    link: 'https://opensea.io/zh-CN/collection/soulda16club'
  },
  {
    icon: 'https://i.seadn.io/gae/BdxvLseXcfl57BiuQcQYdJ64v-aI8din7WPk0Pgo3qQFhAUH-B6i-dCqqc_mCkRIzULmwzwecnohLhrcH8A9mpWIZqA7ygc52Sr81hE?auto=format&w=384',
    name: 'cryptopunks',
    link: 'https://opensea.io/zh-CN/collection/cryptopunks'
  },
  {
    icon: 'https://i.seadn.io/gae/Ju9CkWtV-1Okvf45wo8UctR-M9He2PjILP0oOvxE89AyiPPGtrR3gysu1Zgy0hjd2xKIgjJJtWIc0ybj4Vd7wv8t3pxDGHoJBzDB?auto=format&w=384',
    name: 'boredapeyachtclub',
    link: 'https://opensea.io/zh-CN/collection/boredapeyachtclub'
  },
  {
    icon: 'https://i.seadn.io/gae/H8jOCJuQokNqGBpkBN5wk1oZwO7LM8bNnrHCaekV2nKjnCqw6UB5oaH8XyNeBDj6bA_n1mjejzhFQUP3O1NfjFLHr3FOaeHcTOOT?auto=format&w=384',
    name: 'azuki',
    link: 'https://opensea.io/zh-CN/collection/azuki'
  },
  {
    icon: 'https://i.seadn.io/gae/H-eyNE1MwL5ohL-tCfn_Xa1Sl9M9B4612tLYeUlQubzt4ewhr4huJIR5OLuyO3Z5PpJFSwdm7rq-TikAh7f5eUw338A2cy6HRH75?auto=format&w=384',
    name: 'proof-moonbirds',
    link: 'https://opensea.io/zh-CN/collection/proof-moonbirds'
  },
  {
    icon: 'https://i.seadn.io/gae/mZZpy1L0umW_XniBCeZNX92HncdlMsGLqlEYzsZ4t986HyF7Z1TwYPJ7sJb7VjQqxWwdTOlkr7Au-fQHTcxDB6AxM6VOY8AzzOyMzw?auto=format&w=384',
    name: 'mimicshhans',
    link: 'https://opensea.io/zh-CN/collection/mimicshhans'
  }
]

export const POW_IMG_BASE64 = `data:image/png;base64,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`


export const CLOSE_IMG_BASE64 = `data:image/png;base64,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`

export const PLAY_ICON_BASE64 = `data:image/png;base64,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`