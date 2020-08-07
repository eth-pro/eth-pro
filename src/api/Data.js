import _ from 'lodash'
import Base from './Base'
import {web3, calcTime} from '../utils/Wallet'
import { SUMMARY, ETHSCANIO_API, ETHSCANIO_APIKEY, ABI_URL } from '@/config/url'

import Web3 from 'web3'
export default class Data extends Base {
  static async summary() {
    return await this.request(SUMMARY)
  }

  static async txList(address, start, end) {
    return await this.request(ETHSCANIO_API, {
      module: 'account',
      action: 'txlist',
      address: address,
      startblock: start,
      endblock: end,
      sort: 'desc',
      apikey: ETHSCANIO_APIKEY
    })
  }

  
  static async eventList(address, start, topic0 = null, topic1 = null, topic2 = null, topic3 = null, toBlock = 'latest') {
    console.log({
      module: 'logs',
      action: 'getLogs',
      address: address,
      topic0: topic0,
      topic1: topic1,
      topic2: topic2,
      topic3: topic3,
      fromBlock: start,
      toBlock: toBlock,
      apikey: ETHSCANIO_APIKEY
    })
    return await this.request(ETHSCANIO_API, {
      module: 'logs',
      action: 'getLogs',
      address: address,
      topic0: topic0,
      topic1: topic1,
      topic2: topic2,
      topic3: topic3,
      fromBlock: start,
      toBlock: toBlock,
      apikey: ETHSCANIO_APIKEY
    })
  }

  static async request(url, params = {}, type = 'get', config = {}) {
    const response = await this.call(url, params, type, config)
    return response
  }
  
}
