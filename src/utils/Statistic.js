
import _ from 'lodash'
import {web3, getContractAddress, formatWei} from './Wallet'
import store from '@/store'
import Data from '@/api/Data'
import Timer from 'timer.js'
import { reject } from 'any-promise';
import { CONTARCT_MININGSHARESIMPL, EVENT_PURCHASE_TIPIC, CONTARCT_DATA, CONTARCT_XCOINCONVERTER, EVENT_EXCHANGE_TIPIC, CROPTY_ETH, CROPTY_MS, EVNET_ADDRESS, CONTARCT_MININGSHARES, CONTARCT_EVENTER, CONTARCT_ETHPRO } from '../config/wallet';
import { STATISTIC_UPDATE_DATA } from '../store/mutation-types';

export default class Statistic {
  constructor() {
    this.instance = null
    this.web3 = web3
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Statistic()
    }
    return this.instance
  }

  async init() {
    this.update_timer = new Timer({
      tick: 300,
      ontick: _.throttle(() => {
        this.update()
      }, 300000)
    })
    await this.update()
    this.update_timer.start(3600)
  }

  async update() {
    const [start_block, current_block_number] = await this.estimatBlockHeight()
    const ret = await Data.eventList(getContractAddress(CONTARCT_ETHPRO), start_block, '0xfaadf08c2c8671e36d7e9aa9e1873fc9b16bea4e73be146c2f84213f043db629')
    const event_list = ret.data.result
    const price_data = []
    for(let i = 0; i < event_list.length; i++){
      const contract_info = CONTARCT_DATA[CONTARCT_ETHPRO]
      const params_format = _.find(contract_info.abi, {type:'event',name: 'Price'})
      
      const params = this.web3.eth.abi.decodeLog(params_format.inputs, event_list[i].data)
      const timestamp = this.web3.utils.hexToNumber(event_list[i].timeStamp) * 1000
      const price = params._price
      price_data.push({
        timestamp: timestamp,
        price: price
      })
    }
    
    const timestamp = new Date(new Date().toLocaleDateString()).getTime() + new Date().getHours() * 3600 * 1000
    const last_week = timestamp - 7 * 24 * 3600 * 1000
    let is_show_exchange = false
    const start_timestamp = new Date('2019-08-29 00:00').getTime()
    if(start_timestamp <= last_week && false){
      
      is_show_exchange = true
    }

    const chart_data = []
    let price_data_index = 0
    let last_price = 0.01
    let price_24h = 0
    let price_7days = 0
    let max_price = last_price
    let min_price = 999999
    console.log(price_data)
    for(let hour = 0; last_week + hour * 3600 * 1000 <= timestamp; hour++){
      let point_timestamp = last_week + hour * 3600 * 1000
      if(typeof price_data[price_data_index] != 'undefined'){
        while(typeof price_data[price_data_index] != 'undefined' && point_timestamp >= price_data[price_data_index].timestamp){
          last_price = parseFloat(_.floor(formatWei(price_data[price_data_index].price), 8))
          if(last_price > max_price){
            max_price = last_price
          }

          if(min_price > last_price){
            min_price = last_price
          }

          price_data_index++
        }
      }
      
      if(point_timestamp + 24 * 3600 * 1000 >= timestamp && point_timestamp + 23 * 3600 * 1000 <= timestamp){
        price_24h = last_price
      }
      chart_data.push([point_timestamp, last_price])
    }

    if(price_data.length > 0 && chart_data[chart_data.length - 1][0] < price_data[price_data.length - 1].timestamp){
      last_price = parseFloat(_.floor(formatWei(price_data[price_data.length - 1].price), 8))
    }
    
    price_7days = chart_data[0][1]
    
    let block_increase = price_24h == 0 ? 0 : (last_price - price_24h) / price_24h
    let block_increase7_day = price_7days == 0 ? 0 : (last_price - price_7days) / price_7days

    const last_update = parseInt(Date.now() / 1000) * 1000

    console.log(chart_data)
    store.commit(STATISTIC_UPDATE_DATA, {
      chart_data,
      last_price,
      price_24h,
      price_7days,
      block_increase,
      block_increase7_day,
      last_update,
      max_price,
      min_price
    })
  }
  
  estimatBlockHeight() {
    
    return new Promise((resolve,reject) => {
      this.web3.eth.getBlockNumber().then((current_block_number) => {
        resolve([_.floor(current_block_number - (7 * 24 * 3600)/ 10), current_block_number])
      }).catch(reject)
    })
  }
}
