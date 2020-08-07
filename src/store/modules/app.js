import { SET_LANG,SET_WALLET,SET_IS_WALLET,SET_IS_GUIDE,SET_IS_NO_WALLET } from '../mutation-types'

export default {
  state: {
    lang: 'en',
    wallet: '',
    is_wallet: false,
    is_guide: false,
    is_no_wallet: false
  },
  getters: {
    lang: state => {
      return state.lang
    },
    is_imtoken: state => {
      return state.is_imtoken
    },
    is_wallet: state => {
      return state.is_wallet
    }
  },
  actions: {
    update_env: function({ commit }, {wallet, is_wallet}) {
      commit(SET_WALLET, wallet)
      commit(SET_IS_WALLET, is_wallet)
    }
  },
  mutations: {
    [SET_LANG](state, lang) {
      state.lang = lang
    },
    [SET_WALLET](state, is_imtoken) {
      state.is_imtoken = is_imtoken
    },
    [SET_IS_WALLET](state, is_wallet) {
      state.is_wallet = is_wallet
    },
    [SET_IS_GUIDE](state, payload) {
      state.is_guide = payload
    },
    [SET_IS_NO_WALLET](state, payload) {
      state.is_no_wallet = payload
    }
  }
}
