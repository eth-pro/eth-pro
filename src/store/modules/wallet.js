import {
  UPDATE,
  SET_ADDRESS,
  CLEAN_BALANCE,
  SET_INVITE_CODE,
  SET_PENDING_HISTORY_LIST,
  APPEND_PENDING_HISTORY_LIST,
  REMOVE_PENDING_HISTORY_LIST,
  SET_HISTORY_LIST
} from '../mutation-types'

export default {
  state: {
    pending_history_list: [],
    history_list: [],
    
    address: null,
    invite_code: '',
    balance: 0,    
    pending_history_list: [],
    history_list: [],

    distributePool: 0,
    top3Pool: 0,
    boxPool: 0,
    insuranceFund: 0,
    devFund: 0,
    totalInvestment: 0,
    lastSeriesNo: 0,
    restartNo: 0,
    boxExpire: 0,
    boxLastSeriesNo: 0,
    ethTax: 0,
    
    invite_top1_address: '',
    invite_top1_total: 0,
    invite_top1_reward: 0,
    invite_top2_address: '',
    invite_top2_total: 0,
    invite_top2_reward: 0,
    invite_top3_address: '',
    invite_top3_total: 0,
    invite_top3_reward: 0,

    m_totalSupply: 0,
    reserve: 0,
    profitPool: 0,
    totalProfited: 0,
    totalDestroyed: 0,
    price: 0,
    totalStaking: 0,
    lastTotalInvestment: 0,
    currTotalInvestment: 0,

    
    seriesNo: 0,
    investment: 0,
    eth: 0,
    ethDone: 0,
    distributeLastTime: 0,
    quitted: 0,

    parent: '',
    sonCount: 0,
    sonNodeCount: 0,
    sonAmount: 0,
    sonAmountPre: 0,
    sonAmountDate: 0,
    boxReward: 0,

    resetData: 0,
    quitable: 0,
    subCoin: 0,
    balanceOfToken: 0,
    stakingOf: 0,
    profitedOf: 0,
    profitingOf: 0,

    r0: 0,
    r1: 0,
    r2: 0,
    r3: 0,
    r4: 0,
    r5: 0,
    r6: 0,
    r7: 0,
    r8: 0,
    r9: 0,
    
    top3_last_reward: 0, 
    top3_is_get: 0, 
    r10: 0,
  },
  getters: {
    address: state => {
      return state.address
    },
    invite_code: state => {
      return state.invite_code
    },
    balance: state => {
      return state.balance
    },
  },
  mutations: {
    [UPDATE](state, payload) {
      console.log(payload)
      for(const key in payload){
        if(typeof state[key] != 'undefined')  state[key] = payload[key]
      }
    },
    [SET_ADDRESS](state, payload) {
      state.address = payload
    },
    [SET_INVITE_CODE](state, payload) {
      if (payload === 0) {
        state.invite_code = ''
      } else {
        state.invite_code = payload
      }
    },
    [SET_PENDING_HISTORY_LIST](state, payload) {
      state.pending_history_list = payload
    },
    [APPEND_PENDING_HISTORY_LIST](state, payload){
      state.pending_history_list = _.concat([payload], state.pending_history_list)
    },
    [REMOVE_PENDING_HISTORY_LIST](state, payload){
      _.remove( state.pending_history_list, (item) => {
        return item.hash == payload
      })
    },
    [SET_HISTORY_LIST](state, payload) {
      state.history_list = payload
    }
  }
}
