import _ from 'lodash'
import store from '@/store'
import Data from '@/api/Data'
import InputDataDecoder from 'ethereum-input-data-decoder'
import Tx from '@/model/tx'
import {getContractByAddress} from '@/utils/Wallet'
import { CONTARCT_DATA } from '../config/wallet'
import { SET_HISTORY_LIST, REMOVE_PENDING_HISTORY_LIST } from '../store/mutation-types'

const SUPPORT_METHOD = [
  'play',
  'redeem',
  'purchase',
  'quit',
  'stake',
  'unstake',
  'divideprofit',
  'getboxreward',
  'distributionreward',
  'transfer',
  'gettop3reward',
]

let is_updatding = false


export async function initHistory(){
  is_updatding = true
  await updateHistoryList()
  is_updatding = false

  setInterval(async () => {
    if(is_updatding){
      return false
    }
    is_updatding = true
    await updateHistoryList()
    is_updatding = false
  }, 15000)
}


export function getTransactionDetail(tx) {
  const contract = getContractByAddress(tx.to)
  if (contract.length == 0) {
    return false
  }
  const input = getTransactionInput(contract, tx.input)
  tx = _.set(tx, 'contract', contract)
  return _.set(tx, 'input_format', input)
}

export function getTransactionInput(contract, data) {
  const mix_abi = _.concat(...contract.map((c) => _.get(CONTARCT_DATA, c + '.abi')))
  const decoder = new InputDataDecoder(mix_abi)
  const result = decoder.decodeData(data)
  return result
}

export async function getHistoryList(address){
  const history_list = []
  let result = await Data.txList(address, 0, 99999999)
  if (parseInt(result.data.status) == 0) {
    return history_list
  }
  const list = result.data.result
  for (let i = 0; i < list.length; i++) {
    
    const detail = getTransactionDetail(list[i])
    if (detail === false) continue
    if (typeof detail.input_format.method == 'undefined' ||  detail.input_format.method == null) continue
    if (
      SUPPORT_METHOD.indexOf(detail.input_format.method.toLowerCase()) ==
      -1
    ) {
      continue
    }
    const tx = new Tx()
    tx.method = detail.input_format.method
    tx.block = detail.blockNumber
    tx.amount = detail.value
    tx.timestamp = detail.timeStamp
    
    tx.status = parseInt(detail.isError) == 0 ? 1 : 0
    tx.fee = detail.gasUsed * detail.gasPrice
    tx.hash = detail.hash
    tx.confirm_block = detail.confirmations
    tx.from = detail.from
    tx.to = detail.to
    tx.contract = detail.contract

    history_list.push(tx)
  }
  return history_list
}

export async function updateHistoryList(){
  const list =await getHistoryList(store.state.wallet.address)
  _.forEach(store.state.wallet.pending_history_list, (tx) => {
    if(_.findIndex(list, {hash: tx.hash}) > -1){
      store.commit(REMOVE_PENDING_HISTORY_LIST, tx.hash)
    }
  })
  store.commit(SET_HISTORY_LIST, list)
}