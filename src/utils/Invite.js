import _ from 'lodash'
import Data from '@/api/Data'
import { CONTARCT_DATA, CONTARCT_ETHPRO} from '../config/wallet';
import {web3, trim, formatWei, isAddress, getContractAddress, getAddress} from '@/utils/Wallet'
import store from '../store'
import { utils } from 'web3';
import { calcBlock } from './Wallet';

export async function getList1() {
  let address = getAddress()
  address = address.replace('0x','0x000000000000000000000000')
  const ret = await Data.eventList(getContractAddress(CONTARCT_ETHPRO), calcBlock(), '0x1ae00033f78a24b0e0cb734f176cbecd4ee22b206737a14d9f242538844aec65', null, null)
  const event_list = ret.data.result
  const list = []
  const contract_info = CONTARCT_DATA[CONTARCT_ETHPRO]
  const params_format = _.find(contract_info.abi, {type:'event',name: 'logAddrAmount'})
  delete params_format.inputs[0]
  delete params_format.inputs[1]
  for(let i = 0; i < event_list.length; i++){
    const params = web3.eth.abi.decodeLog(params_format.inputs, event_list[i].data)
    const amount = formatWei(params.amount)
    const logtime = params.logtime * 1000
    const send = params.send
    list.push({
      amount,
      logtime,
      send
    })
  }
  return list.reverse()
}


export async function getList2() {
  let restartNo = utils.padLeft(utils.numberToHex(store.state.wallet.restartNo), 64)
  const ret = await Data.eventList(getContractAddress(CONTARCT_ETHPRO), calcBlock(), '0xd2fb33acf3a27ac5107604b2e434858447d771a059c22bec654fa96ebde88cde', restartNo, null)
  const event_list = ret.data.result
  const list = []
  const contract_info = CONTARCT_DATA[CONTARCT_ETHPRO]
  const params_format = _.find(contract_info.abi, {type:'event',name: 'logProfit'})
  delete params_format.inputs[0]
  for(let i = 0; i < event_list.length; i++){
    const params = web3.eth.abi.decodeLog(params_format.inputs, event_list[i].data)
    const profitAmount = formatWei(params.profitAmount)
    const invitAmount = formatWei(params.invitAmount)
    const addr = params.addr
    list.push({
      profitAmount,
      invitAmount,
      addr
    })
  }
  return _.uniqBy(_.sortBy(list, item => parseFloat(item.invitAmount)).reverse(), 'addr').slice(0, 3)
}

export async function getList3() {
  let address = getAddress()
  address = address.replace('0x','0x000000000000000000000000')
  let restartNo = utils.padLeft(utils.numberToHex(store.state.wallet.restartNo), 64)
  const ret = await Data.eventList(getContractAddress(CONTARCT_ETHPRO), 0, '0xf2531eca1f304c5bd5f42fc86493d0467d9cfc7d8d3b13e59337d621c84d66d1', restartNo, address)
  const event_list = ret.data.result
  
  
  const list = []
  const contract_info = CONTARCT_DATA[CONTARCT_ETHPRO]
  const params_format = _.find(contract_info.abi, {type:'event',name: 'loglink'})
  delete params_format.inputs[0]
  delete params_format.inputs[1]
  delete params_format.inputs[2]
  for(let i = 0; i < event_list.length; i++){
    const params = web3.eth.abi.decodeLog(params_format.inputs, event_list[i].data)
    const addr = '0x' + event_list[i].topics[3].slice(-40)
    const sonCount = params.sonCount
    const nodeCount = params.nodeCount
    const supNodeCount = params.supNodeCount
    const invitAmount = formatWei(params.invitAmount) 
    const investment = formatWei(params.investment) 
	const firstTime = params.firstTime * 1000

    list.push({
      addr,
      sonCount,
      nodeCount,
      supNodeCount,
      investment,
      invitAmount,
	  firstTime
	  
    })
  }
  
  return _.uniqBy(list.reverse(), 'addr')
}

export async function getList4(no) {
  let address = getAddress()
  address = address.replace('0x','0x000000000000000000000000')
  if(no == 0 ){
    no = 1
  }
  let boxLastSeriesNo = utils.padLeft(utils.numberToHex(no), 64)
  const ret = await Data.eventList(getContractAddress(CONTARCT_ETHPRO), calcBlock(), '0x1ae00033f78a24b0e0cb734f176cbecd4ee22b206737a14d9f242538844aec65', null ,boxLastSeriesNo)
  const event_list = ret.data.result
  const list = []
  const contract_info = CONTARCT_DATA[CONTARCT_ETHPRO]
  const params_format = _.find(contract_info.abi, {type:'event',name: 'logAddrAmount'})

  delete params_format.inputs[0]
  delete params_format.inputs[1]
  for(let i = 0; i < event_list.length; i++){
    const params = web3.eth.abi.decodeLog(params_format.inputs, event_list[i].data)
    const amount = formatWei(params.amount)
    const logtime = params.logtime *1000
    const send = params.send
    list.push({
      amount,
      logtime,
      send
    })
  }
  return list.reverse()
}



export async function getProfitList(address) {
  if(!isAddress(address)){
    return []
  }
  address = address.replace('0x','0x000000000000000000000000')
  const ret = await Data.eventList(getContractAddress(CONTARCT_EMEVENTER), calcBlock(), EVENT_PROFIT, address)
  const event_list = ret.data.result
  const list = []
  const contract_info = CONTARCT_DATA[CONTARCT_EMINFO]
  const params_format = _.find(contract_info.abi, {type:'event',name: 'Profit'})
  delete params_format.inputs[0]
  delete params_format.inputs[1]
  for(let i = 0; i < event_list.length; i++){
    const {_data1, _data2, _data3, _data4, _profit} = web3.eth.abi.decodeLog(params_format.inputs, event_list[i].data)
    const type = trim(web3.utils.hexToAscii(event_list[i].topics[2]))
    const profit = formatWei(_profit)
    const timestamp = web3.utils.hexToNumber(event_list[i].timeStamp) * 1000
    const hash = event_list[i].transactionHash
    list.push({
      type,
      profit,
      timestamp,
      hash
    })
  }
  return list.reverse()
}


export async function getRecvLuckList(address) {
  if(!isAddress(address)){
    return []
  }
  address = address.replace('0x','0x000000000000000000000000')
  const ret = await Data.eventList(getContractAddress(CONTARCT_EMEVENTER), calcBlock(), EVENT_RECVLUCK, address)
  const event_list = ret.data.result
  const list = []
  const contract_info = CONTARCT_DATA[CONTARCT_EMINFO]
  const params_format = _.find(contract_info.abi, {type:'event',name: 'RecvLuck'})
  delete params_format.inputs[0]
  delete params_format.inputs[1]
  for(let i = 0; i < event_list.length; i++){
    const {_profit} = web3.eth.abi.decodeLog(params_format.inputs, event_list[i].data)
    const profit = formatWei(_profit)
    const timestamp = web3.utils.hexToNumber(event_list[i].timeStamp) * 1000
    const hash = event_list[i].transactionHash
    list.push({
      profit,
      timestamp,
      hash
    })
  }
  return list.reverse()
}