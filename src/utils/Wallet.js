import Web3, {utils} from 'web3'
import store from '@/store'
import BigNumber from 'bignumber.js'
import Timer from 'timer.js'
import _ from 'lodash'
import InputDataDecoder from 'ethereum-input-data-decoder'
import Tx from '@/model/tx'
import { CONTARCT_ETHPRO, CONTARCT_DATA} from '../config/wallet';
import { UPDATE, APPEND_PENDING_HISTORY_LIST,SET_HISTORY_ADDRESS } from '../store/mutation-types';

const MAX_REQUEST_TIME = 20000

export let web3 = null,
eminfo_update_timer = null;

const avg_time = 15
let current_block = 0
let current_time = 0

export async function initBlockInfo(){
  current_block = await web3.eth.getBlockNumber()
  current_time = parseInt(Date.now()/1000)
}

export function calcTime(blockNumer){
  return parseInt(current_time) - (current_block - parseInt(blockNumer))* 15
}

export function calcBlock(time = 86400){
  return parseInt(current_block) - time / 15
}

export async function initConnection() {
  if(store.state.app.is_wallet){
    const provider = window.ethereum || window.web3.currentProvider
    web3 = new Web3(provider)
    if(typeof window.ethereum != 'undefined'){
      await window.ethereum.enable()
    }
  }else{
    return false
    const RPC = BUILD_TYPE == "PROD" ? 'https://mainnet.infura.io/v3/29b8e481a3be4459b0936f32c3d0fa88' : 'https://ropsten.infura.io/v3/29b8e481a3be4459b0936f32c3d0fa88'
    web3 = new Web3(RPC)
  }
  await initBlockInfo()
  return web3
}

export function initTimer() {
  eminfo_update_timer = new Timer({
    tick: 15,
    ontick: _.throttle(() => {
      updateEmInfo()
    }, 10000)
  })
}

export function startTimer() {
  if(eminfo_update_timer != null && eminfo_update_timer.getStatus() != 'started'){
    eminfo_update_timer.start(99999999)
  }
}

export async function initData() {
  try {
    await updateEmInfo()
  }catch(e){
    console.log(e)
  }
}

export async function init() {
  try {
    await initConnection()
    await updateEmInfo()
    initTimer()
    startTimer()
  }catch(e){
    console.log(e)
  }
}

export function getContract(contract = CONTARCT_ETHPRO) {
  const contract_info = CONTARCT_DATA[contract]
  return new web3.eth.Contract(contract_info.abi, contract_info.address)
}

export function getContractAddress(contract) {
  const contract_info = CONTARCT_DATA[contract]
  return contract_info.address
}

export function getContractByAddress(address) {
  let contract_list = []
  for (const contract in CONTARCT_DATA) {
    if (
      address.toLocaleLowerCase() ==
      CONTARCT_DATA[contract].address.toLocaleLowerCase()
    ) {
      contract_list.push(contract)
    }
  }
  return contract_list
}

export async function updateEmInfo() {
  let data = await Promise.all([getInfo(), getUserInfo(getAddress()), getAddress(), getBalance(getAddress())])
  
  console.log(data)
  const [
      [
        distributePool,
        top3Pool, 
        boxPool,
        insuranceFund, 
        devFund, 
        totalInvestment, 
        lastSeriesNo,
        restartNo, 
        boxExpire,
        boxLastSeriesNo,
        ethTax,
        invite_top1_address,
        invite_top1_total,
        invite_top1_reward,
        invite_top2_address,
        invite_top2_total,
        invite_top2_reward,
        invite_top3_address,
        invite_top3_total,
        invite_top3_reward,

        m_totalSupply,
        reserve,
        profitPool,
        totalProfited,
        totalDestroyed,
        price,
        totalStaking,
        owner,
        weight,
        lastTotalInvestment,
        currTotalInvestment,
        ...args
      ],
      [
        seriesNo,
        investment,
        eth,
        ethDone,
        distributeLastTime,
        quitted,

        parent,
        sonCount,
        sonNodeCount,
        sonAmount,
        sonAmountPre,
        sonAmountDate,
        boxReward,

        resetData,
        quitable,
        subCoin,
        balanceOfToken,
        stakingOf,
        profitedOf,

        r0,
        r1,
        r2,
        r3 ,
        r4,
        r5,
        r6,
        r7,
        r8,
        r9,
        profitingOf, 
        top3_last_reward, 
        top3_is_get, 
        r10, 
    ],
    address,
    balance,
  ] = data
  store.commit(UPDATE, {
    balance,
    address,

    distributePool,
    top3Pool,
    boxPool,
    insuranceFund,
    devFund,
    totalInvestment,
    lastSeriesNo,
    restartNo,
    boxExpire,
    boxLastSeriesNo,
    ethTax,

    invite_top1_address: utils.numberToHex(invite_top1_address),
    invite_top1_total,
    invite_top1_reward,
    invite_top2_address: utils.numberToHex(invite_top2_address),
    invite_top2_total,
    invite_top2_reward,
    invite_top3_address: utils.numberToHex(invite_top3_address),
    invite_top3_total,
    invite_top3_reward,

    m_totalSupply,
    reserve,
    profitPool,
    totalProfited,
    totalDestroyed,
    price,
    totalStaking,
    lastTotalInvestment,
    currTotalInvestment,



    
    seriesNo,
    investment,
    eth,
    ethDone,
    distributeLastTime,
    quitted,

    parent,
    sonCount,
    sonNodeCount,
    sonAmount,
    sonAmountPre,
    sonAmountDate,
    boxReward,

    resetData,
    quitable,
    subCoin,
    balanceOfToken,
    stakingOf,
    profitedOf,
    profitingOf,

    r0,
    r1,
    r2,
    r3 ,
    r4,
    r5,
    r6,
    r7,
    r8,
    r9,
    top3_last_reward, 
    top3_is_get, 
    r10,
  })
}

export function getInfo() {
  return new Promise((resolve, reject) => {
    const contract_obj = getContract(CONTARCT_ETHPRO)
    contract_obj.methods.getInfo().call().then((data) => {
      resolve(data)
    }).catch(error => {
      reject(error)
    })
    setTimeout(() => {
      reject('timeout')
    }, MAX_REQUEST_TIME)
  })
}

export function getUserInfo(address) {
  console.log(address)
  return new Promise((resolve, reject) => {
    const contract_obj = getContract(CONTARCT_ETHPRO)
    console.log(address)
    contract_obj.methods.getUserInfo(address).call().then((data) => {
      resolve(data)
    }).catch(error => {
      reject(error)
    })
    setTimeout(() => {
      reject('timeout')
    }, MAX_REQUEST_TIME)
  })
}

export function isAddress(address) {
  return utils.isAddress(address)
}

export function getAddress() {
  if(!store.state.app.is_wallet){
    return '0x0000000000000000000000000000000000000000'
  }
  let address = window.web3.eth.defaultAccount || window.ethereum.selectedAddress
  return address
}

export async function getBlock(number) {
  return await web3.eth.getBlock(number)
}

export async function getTransaction(hash){
  return await web3.eth.getTransaction(hash)
}

export async function getBlockTimestamp(number) {
  const {timestamp} = await getBlock(number)
  return timestamp
}

export async function getBalance(address) {
  let balance = 0
  try {
    balance = await this.web3.eth.getBalance(address)
  } catch (e) {}
  return balance
}


export function formatWei(amount) {
  return utils.fromWei(new BigNumber(amount).toFixed(), 'ether')
}

export function toWei(amount) {
  return utils.toWei(new BigNumber(amount).toFixed(), 'ether')
}

export function toByte(mixed, length = 32) {
  if(!utils.isHexStrict(mixed)){
    mixed = utils.toHex(mixed)
  }
  return utils.padRight(mixed, length)
}

export function trim(value) {
  return value.trim().replace(/[\0\s]*/g, '')
}

export function isValidCode(code){
  return new Promise((resolve, reject) => {
    const contract_obj = getContract(CONTARCT_ETHPRO)
    contract_obj.methods.isValid(web3.utils.fromAscii(code, 32)).call().then((data) => {
      resolve(data)
    }).catch(error => {
      reject(error)
    })
  })
}

/**
 * 发送token
 */
export async function sendTokenTransaction(to, amount) {
  try {
    const contract_obj = getContract(CONTARCT_ETHPRO)
	let gas = 1880000
    try {
      gas = await contract_obj.methods
      .transfer(to, toWei(amount))
      .estimateGas({
        from: getAddress()
      })
    }catch(e){
      
    }
    contract_obj.methods
      .transfer(
        to,
        toWei(amount)
      )
      .send({
        from: getAddress(),
        gas,
      })
      .on('transactionHash', hash => {
        const tx = new Tx()
        tx.method = 'transfer'
        tx.block = 0
        tx.amount = toWei(amount)
        tx.timestamp = parseInt(new Date().getTime() / 1000)
        
        tx.status = 2
        tx.fee = 0
        tx.hash = hash
        tx.confirm_block = 0
        tx.from = getAddress()
        tx.to = to
        tx.contract = CONTARCT_ETHPRO

        store.commit(APPEND_PENDING_HISTORY_LIST, tx)
      })
      .on('error', console.error)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

/**
 * 卖出
 * @param {} amount 
 * @param {*} invite_code 
 */
export async function redeem(amount) {
  try {
    const contract_obj = getContract(CONTARCT_ETHPRO)
    let gas = 1880000
    try {
      gas = await contract_obj.methods
      .redeem(toWei(amount))
      .estimateGas({
        from: getAddress()
      })
    }catch(e){
      
    }
    contract_obj.methods
      .redeem(toWei(amount))
      .send({
        from: getAddress(),
        gas
      })
      .on('transactionHash', hash => {
        const tx = new Tx()
        tx.method = 'redeem'
        tx.block = 0
        tx.amount = toWei(amount)
        tx.timestamp = parseInt(new Date().getTime() / 1000)
        tx.status = 2
        tx.fee = 0
        tx.hash = hash
        tx.confirm_block = 0
        tx.from = getAddress()
        tx.to = contract_obj.options.address
        tx.contract = CONTARCT_ETHPRO

        store.commit(APPEND_PENDING_HISTORY_LIST, tx)
      })
      .on('error', console.error)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}




/**
 * 买入
 * @param {*} amount 
 */
export async function purchase(amount) {
  try {
    const contract_obj = getContract(CONTARCT_ETHPRO)

    let gas = 1880000
    try {
      gas = await contract_obj.methods
      .purchase()
      .estimateGas({
        from: getAddress(),
        value: toWei(amount)
      })
    }catch(e){
      
    }

    contract_obj.methods
      .purchase()
      .send({
        from: getAddress(),
        value: toWei(amount),
        gas
      })
      .on('transactionHash', hash => {
        const tx = new Tx()
        tx.method = 'purchase'
        tx.block = 0
        tx.amount = toWei(amount)
        tx.timestamp = parseInt(new Date().getTime() / 1000)
        tx.status = 2
        tx.fee = 0
        tx.hash = hash
        tx.confirm_block = 0
        tx.from = getAddress()
        tx.to = contract_obj.options.address
        tx.contract = CONTARCT_ETHPRO
        
        store.commit(APPEND_PENDING_HISTORY_LIST, tx)
      })
      .on('error', console.error)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}



/**
 * 买入
 * @param {*} amount 
 */
export async function quit() {
  try {
    const contract_obj = getContract(CONTARCT_ETHPRO)

    let gas = 1880000
    try {
      gas = await contract_obj.methods
      .quit()
      .estimateGas({
        from: getAddress()
      })
    }catch(e){
      
    }

    contract_obj.methods
      .quit()
      .send({
        from: getAddress(),
        gas
      })
      .on('transactionHash', hash => {
        const tx = new Tx()
        tx.method = 'quit'
        tx.block = 0
        tx.amount = 0
        tx.timestamp = parseInt(new Date().getTime() / 1000)
        tx.status = 2
        tx.fee = 0
        tx.hash = hash
        tx.confirm_block = 0
        tx.from = getAddress()
        tx.to = contract_obj.options.address
        tx.contract = CONTARCT_ETHPRO
        
        store.commit(APPEND_PENDING_HISTORY_LIST, tx)
      })
      .on('error', console.error)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

/**
 * stake
 * @param {*} amount 
 */
export async function stake(amount) {
  try {
    const contract_obj = getContract(CONTARCT_ETHPRO)
    let gas = 1880000
    try {
      gas = await contract_obj.methods
      .stake(toWei(amount))
      .estimateGas({
        from: getAddress()
      })
    }catch(e){
      
    }
    contract_obj.methods
      .stake(toWei(amount))
      .send({
        from: getAddress(),
        gas
      })
      .on('transactionHash', hash => {
        const tx = new Tx()
        tx.method = 'stake'
        tx.block = 0
        tx.amount = toWei(amount)
        tx.timestamp = parseInt(new Date().getTime() / 1000)
        tx.status = 2
        tx.fee = 0
        tx.hash = hash
        tx.confirm_block = 0
        tx.from = getAddress()
        tx.to = contract_obj.options.address
        tx.contract = CONTARCT_ETHPRO

        store.commit(APPEND_PENDING_HISTORY_LIST, tx)
      })
      .on('error', console.error)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}



/**
 * 撤回
 * @param {*} amount 
 */
export async function unstake(amount) {
  try {
    const contract_obj = getContract(CONTARCT_ETHPRO)
    let gas = 1880000
    try {
      gas = await contract_obj.methods
      .unstake(toWei(amount))
      .estimateGas({
        from: getAddress()
      })
    }catch(e){
      
    }
    contract_obj.methods
      .unstake(toWei(amount))
      .send({
        from: getAddress(),
        gas
      })
      .on('transactionHash', hash => {
        const tx = new Tx()
        tx.method = 'unstake'
        tx.block = 0
        tx.amount = toWei(amount)
        tx.timestamp = parseInt(new Date().getTime() / 1000)
        tx.status = 2
        tx.fee = 0
        tx.hash = hash
        tx.confirm_block = 0
        tx.from = getAddress()
        tx.to = contract_obj.options.address
        tx.contract = CONTARCT_ETHPRO

        store.commit(APPEND_PENDING_HISTORY_LIST, tx)
      })
      .on('error', console.error)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}



/**
 * 领取分润
 * @param {*} amount 
 */
export async function divideProfit() {
  try {
    const contract_obj = getContract(CONTARCT_ETHPRO)
    let gas = 1880000
    try {
      gas = await contract_obj.methods
      .divideProfit()
      .estimateGas({
        from: getAddress()
      })
    }catch(e){
      
    }
    contract_obj.methods
      .divideProfit()
      .send({
        from: getAddress(),
        gas
      })
      .on('transactionHash', hash => {
        const tx = new Tx()
        tx.method = 'divideProfit'
        tx.block = 0
        tx.amount = 0
        tx.timestamp = parseInt(new Date().getTime() / 1000)
        tx.status = 2
        tx.fee = 0
        tx.hash = hash
        tx.confirm_block = 0
        tx.from = getAddress()
        tx.to = contract_obj.options.address
        tx.contract = CONTARCT_ETHPRO

        store.commit(APPEND_PENDING_HISTORY_LIST, tx)
      })
      .on('error', console.error)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

/**
 * 开宝箱
 */
export async function getBoxReward() {
  try {
    const contract_obj = getContract(CONTARCT_ETHPRO)
    let gas = 1880000
    try {
      gas = await contract_obj.methods
      .getBoxReward()
      .estimateGas({
        from: getAddress()
      })
    }catch(e){
      
    }
    contract_obj.methods
      .getBoxReward()
      .send({
        from: getAddress(),
        gas
      })
      .on('transactionHash', hash => {
        const tx = new Tx()
        tx.method = 'getBoxReward'
        tx.block = 0
        tx.amount = 0
        tx.timestamp = parseInt(new Date().getTime() / 1000)
        tx.status = 2
        tx.fee = 0
        tx.hash = hash
        tx.confirm_block = 0
        tx.from = getAddress()
        tx.to = contract_obj.options.address
        tx.contract = CONTARCT_ETHPRO

        store.commit(APPEND_PENDING_HISTORY_LIST, tx)
      })
      .on('error', console.error)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

/**
 * 参与
 */
export async function play(amount) {
  try {
    const contract_obj = getContract(CONTARCT_ETHPRO)
    const address = isAddress(store.state.base.ref_invite_code) ? store.state.base.ref_invite_code : '0x0000000000000000000000000000000000000000'
    let gas = 1880000
    try {
      gas = await contract_obj.methods
      .play(address)
      .estimateGas({
        from: getAddress(),
        value: toWei(amount)
      })
      gas = parseInt(gas * 1.2)
    }catch(e){

    }
    contract_obj.methods
      .play(address)
      .send({
        from: getAddress(),
        value: toWei(amount),
        gas,
      })
      .on('transactionHash', hash => {
        const tx = new Tx()
        tx.method = 'play'
        tx.block = 0
        tx.amount = toWei(amount)
        tx.timestamp = parseInt(new Date().getTime() / 1000)
        tx.status = 2
        tx.fee = 0
        tx.hash = hash
        tx.confirm_block = 0
        tx.from = getAddress()
        tx.to = contract_obj.options.address
        tx.contract = CONTARCT_ETHPRO
        store.commit(APPEND_PENDING_HISTORY_LIST, tx)
      })
      .on('error', console.error)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}



/**
 * 立即结算
 */
export async function distributionReward() {
  try {
    const contract_obj = getContract(CONTARCT_ETHPRO)
    let gas = 1880000
    try {
      gas = await contract_obj.methods
      .distributionReward()
      .estimateGas({
        from: getAddress()
      })
      gas = parseInt(gas * 1.2)
    }catch(e){
      
    }
    contract_obj.methods
      .distributionReward()
      .send({
        from: getAddress(),
        gas
      })
      .on('transactionHash', hash => {
        const tx = new Tx()
        tx.method = 'distributionReward'
        tx.block = 0
        tx.timestamp = parseInt(new Date().getTime() / 1000)
        tx.status = 2
        tx.fee = 0
        tx.hash = hash
        tx.confirm_block = 0
        tx.from = getAddress()
        tx.to = contract_obj.options.address
        tx.contract = CONTARCT_ETHPRO
        store.commit(APPEND_PENDING_HISTORY_LIST, tx)
      })
      .on('error', console.error)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}



/**
 * 领取奖励
 */
export async function getTop3Reward() {
  try {
    const contract_obj = getContract(CONTARCT_ETHPRO)
    let gas = 1880000
    try {
      gas = await contract_obj.methods
      .getTop3Reward()
      .estimateGas({
        from: getAddress()
      })
      gas = parseInt(gas * 1.2)
    }catch(e){
      
    }
    contract_obj.methods
      .getTop3Reward()
      .send({
        from: getAddress(),
        gas
      })
      .on('transactionHash', hash => {
        const tx = new Tx()
        tx.method = 'getTop3Reward'
        tx.block = 0
        tx.timestamp = parseInt(new Date().getTime() / 1000)
        tx.status = 2
        tx.fee = 0
        tx.hash = hash
        tx.confirm_block = 0
        tx.from = getAddress()
        tx.to = contract_obj.options.address
        tx.contract = CONTARCT_ETHPRO
        store.commit(APPEND_PENDING_HISTORY_LIST, tx)
      })
      .on('error', console.error)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}


export function calcPurchaseRet(amount){
  return new Promise((resolve, reject) => {
    const contract_obj = getContract(CONTARCT_ETHPRO)
    contract_obj.methods.calcPurchaseRet(toWei(amount)).call().then((data) => {
      console.log(data)
      resolve(data)
    }).catch(error => {
      reject(error)
    })
  })
}



export function calcRedeemRet(amount){
  return new Promise((resolve, reject) => {
    const contract_obj = getContract(CONTARCT_ETHPRO)
    contract_obj.methods.calcRedeemRet(toWei(amount)).call().then((data) => {
      console.log(data)
      resolve(data)
    }).catch(error => {
      reject(error)
    })
  })
}


