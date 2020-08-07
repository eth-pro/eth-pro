export const WALLET_IMTOKEN = 'imtoken'
export const WALLET_TRUST = 'trust'
export const WALLET_OTHER = 'other'

export const CONTARCT_ETHPRO = 'ethpro'

export const EVENT_RECOMMEND_PERFORMANCE = '0xf68bf24103d72e21f23827eecf16c048590ca4f431b7cc9c738a223f349c5fc1'
export const EVENT_PROFIT = '0xd73b2d8f6edbd7a9d6b20ed54bcdbd9996f9694b28aaee929ea6d97a0b6f6cff'
export const EVENT_RECVLUCK = '0xa8b81ec1786d4409e6c3467d961957979a663c91cc6a4237a07844c84b18ab7e'

let contarct_data = null

export const RPC = BUILD_TYPE == "PROD" ? 'https://mainnet.infura.io/v3/4bee79250a3148f3a4f9df00ed6a742b' : 'https://ropsten.infura.io/v3/4bee79250a3148f3a4f9df00ed6a742b'
let is_privacy_mode = false
try {
  localStorage.getItem('config')
}catch(e) {
  is_privacy_mode = true
}

if (!is_privacy_mode && localStorage.getItem('config') != null) {
  contarct_data = JSON.parse(localStorage.getItem('config'))
} else {
  contarct_data = BUILD_TYPE == 'PROD' ? require('./mainnet.json') : require('./ropsten.json')
}
export const CONTARCT_DATA = contarct_data
