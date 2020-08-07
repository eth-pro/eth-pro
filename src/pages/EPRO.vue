<template>
  <div id="epro">
    <Dashboard></Dashboard>
    <div class="box yellow">
      <div class="left">
        <div class="row">
          <div class="label">{{$t('epro.content_0')}}:</div>
          <div class="value">{{total_dig | floor}}</div>
        </div>
        <div class="row">
          <div class="label">{{$t('epro.content_1')}}:</div>
          <div class="value">{{totalDestroyed | floor}}</div>
        </div>
        <div class="row">
          <div class="label">{{$t('epro.content_2')}}:</div>
          <div class="value">{{reserve | floor}}</div>
        </div>
        <div class="row">
          <div class="label">{{$t('epro.content_3')}}:</div>
          <div class="value">{{m_totalSupply | floor}}</div>
        </div>
      </div>
      <div class="right">
        <div class="row">
          <div class="label">{{$t('epro.content_4')}}:</div>
          <div class="value">{{totalStaking | floor}}</div>
        </div>
        <div class="row">
          <div class="label">{{$t('epro.content_5')}}:</div>
          <div class="value">{{parseFloat(totalInvestment) * 0.025 | floor}}ETH</div>
        </div>
        <div class="row">
          <div class="label">{{$t('epro.content_6')}}:</div>
          <div class="value">{{totalProfited | floor}}ETH</div>
        </div>
        <div class="row">
          <div class="label">{{$t('epro.content_7')}}:</div>
          <div class="value">{{parseFloat(totalInvestment) * 0.025 - parseFloat(totalProfited) | floor}}ETH</div>
        </div>
      </div>
    </div>
    <div class="box blue">
      <div class="left">
        <div class="epro-label">
          {{$t('epro.content_8')}}:
        </div>
        <div class="epro-summary">
          <span class="amount">{{balanceOfToken | floor}}</span><span class="symbol">EPRO</span>
        </div>
      </div>
      <div class="right">
        <div class="btn-group">
          <div class="btn" @click="$refs.redeem.open()">{{$t('epro.content_9')}}</div>
          <div class="btn" @click="$refs.transfer.open()">{{$t('epro.content_10')}}</div>
        </div>
        <div class="btn btn-primary" @click="$refs.purchase.open()">{{$t('epro.content_11')}} </div>
      </div>
    </div>
    <div class="box red">
      <div class="left">
        <div class="row">
          <div class="label">{{$t('epro.content_12')}}:</div>
          <div class="value">{{stakingOf | floor}}</div>
        </div>
        <div class="row">
          <div class="label">{{$t('epro.content_13')}}:</div>
          <div class="value">{{profitedOf | floor}}</div>
        </div>
        <div class="row">
          <div class="label">{{$t('epro.content_14')}}:</div>
          <div class="value">{{profitingOf | floor}}</div>
        </div>
      </div>
      <div class="right">
        <div class="btn-group">
          <div class="btn" @click="$refs.stake.open()">{{$t('epro.content_15')}}</div>
          <div class="btn" @click="$refs.unstake.open()">{{$t('epro.content_16')}}</div>
        </div>
        <div class="btn btn-primary" @click="divideProfit">{{$t('epro.content_17')}}</div>
      </div>
    </div>
    <div class="box green">
      <h2>{{$t('epro.content_18')}}</h2>
      <History class="history"></History>
    </div>

    <Redeem ref="redeem"></Redeem>
    <Purchase ref="purchase"></Purchase>
    <Stake ref="stake"></Stake>
    <Unstake ref="unstake"></Unstake>
    <Transfer ref="transfer"></Transfer>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import {formatWei, toWei, divideProfit} from '@/utils/Wallet.js'
import { SET_REF_INVITE_CODE, SET_CHANNEL, SET_INCOME_DIALOG_SHOW, SET_REINVENT_DIALOG_SHOW} from '@/store/mutation-types'
import Dashboard from '@/pages/EPRO/Dashboard'
import History from '@/pages/EPRO/History'
import Redeem from '@/pages/Dialog/Redeem'
import Purchase from '@/pages/Dialog/Purchase'
import Stake from '@/pages/Dialog/Stake'
import Unstake from '@/pages/Dialog/Unstake'
import Transfer from '@/pages/Dialog/Transfer'

import accounting from 'accounting'

import store from '../store'
export default {
  name: 'EPRO',
  components: {
    Dashboard,
    Redeem,
    Purchase,
    Stake,
    Unstake,
    Transfer,
    History
  },
  async created() {
    
  },
  data() {
    return {

    }
  },
  mounted() {
    this.init()
  },
  filters: {
    floor: function(value, decimal = 2) {
      if(store.state.wallet.address == null){
        return '-'
      }
      if (value == 0) {
        return 0
      }
      return accounting.accounting.formatNumber(_.floor(value, decimal), decimal)
    },
  },
  computed: {
    total_dig: function() {
      return parseFloat(this.totalDestroyed) + parseFloat(this.m_totalSupply)
    },
    ...mapState({
      totalInvestment: state => formatWei(state.wallet.totalInvestment),
	  m_totalSupply: state => formatWei(state.wallet.m_totalSupply),
      totalDestroyed: state => formatWei(state.wallet.totalDestroyed),
      reserve: state => formatWei(state.wallet.reserve),
      profitPool: state => formatWei(state.wallet.profitPool),
      stakingOf: state => formatWei(state.wallet.stakingOf),
      profitedOf: state => formatWei(state.wallet.profitedOf),
      totalProfited: state => formatWei(state.wallet.totalProfited),
      price: state => formatWei(state.wallet.price),
      totalStaking: state => formatWei(state.wallet.totalStaking),
      profitingOf: state => formatWei(state.wallet.profitingOf),
      balanceOfToken: state => formatWei(state.wallet.balanceOfToken),
    })
  },
  methods: {
    init: function() {
      
    },
    divideProfit: function(){
      divideProfit()
    }
  }
}
</script>

<style lang='scss' src='@/assets/css/pages/epro.scss' scoped></style> 