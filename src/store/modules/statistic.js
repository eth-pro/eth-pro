import _ from 'lodash'
import { STATISTIC_SET_IS_LOADING, STATISTIC_CLEAN_ALL, STATISTIC_UPDATE_DATA } from '../mutation-types';

export default {
  state: {
    chart_data: [],
    last_price: 0,
    price_24h: 0,
    price_7days: 0,
    block_increase: 0,
    block_increase7_day: 0,

    max_price: 0,
    min_price: 0,

    exchange_chart_data: [],
    exchange_last_price: 0,
    exchange_vol_24h: 0,
    exchange_price_24h: 0,
    exchange_price_7days: 0,
    exchange_increase: 0,
    exchange_increase7_day: 0,

    last_update: 0,
  },
  getters: {
    chart_data: state => {
      return state.chart_data
    }
  },
  mutations: {
    [STATISTIC_CLEAN_ALL](state) {

    },
    [STATISTIC_UPDATE_DATA](state, payload) {
      state.chart_data = payload.chart_data
      state.last_price = payload.last_price
      state.price_24h = payload.price_24h
      state.price_7days = payload.price_7days
      state.max_price = payload.max_price
      state.min_price = payload.min_price
      state.block_increase = payload.block_increase
      state.block_increase7_day = payload.block_increase7_day

      state.exchange_chart_data = payload.exchange_chart_data
      state.exchange_last_price = payload.exchange_last_price
      state.exchange_vol_24h = payload.exchange_vol_24h
      state.exchange_price_24h = payload.exchange_price_24h
      state.exchange_price_7days = payload.exchange_price_7days
      state.exchange_increase = payload.exchange_increase
      state.exchange_increase7_day = payload.exchange_increase7_day

      state.last_update = payload.last_update
    }
  }
}
