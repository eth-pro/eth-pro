
<template>
  <Dialog id="history_dialog" ref="dialog" @closed="closed" :closeable="true">
    <div slot="content" class="content">
      <h3>{{$t('HISTORY.TITLE')}}</h3>
      
      <template v-if="!is_loading">
        <div class="item" v-for="(item,index) in all.slice((all_page - 1)* per_page, all_page * per_page)" :key="index" :class="{odd: index % 2 == 0}">
        <div class="item-body">
          <div class="item-row item-row1">
            <h4 class="item-title item-body-left">{{$tc('HISTORY.' + item.method.toUpperCase())}}</h4>
            <p class="amount item-body-right" v-if="item.amount > 0">{{item.amount | format_wei}} ETH</p>
          </div>
          <div class="item-row  item-row2">
            <div class="time item-body-left"><span>{{item.timestamp | date}}</span></div>
            <div class="review item-body-right" v-show="item.status == 3">
              <span>{{$t('HISTORY.REVIEW')}}</span>
            </div>
            <div class="pending item-body-right" v-show="item.status == 2">
              <img src="@/assets/img/home/pending.png">
              <span>{{$t('HISTORY.PENDING')}}</span>
            </div>
            <div class="success item-body-right" v-show="item.status == 1">
              <img src="@/assets/img/home/success.png">
              <span>{{$t('HISTORY.SUCCESS')}}</span>
            </div>
            <div class="failed item-body-right" v-show="item.status == 0">
              <img src="@/assets/img/home/fail.png">
              <span>{{$t('HISTORY.FAILED')}}</span>
            </div>
          </div>
        </div>
        <a class="item-right" :href="getTxUrl(item.hash)" target="_bank">
          <img src="@/assets/img/home/collapse_arrow.png">
        </a>
      </div>
      <div v-if="all.length <= 0" class="null">
        <img class="null-img" v-if="$i18n.locale == 'zh-TW'" src="@/assets/img/home/null.png">
        <img class="null-img" v-else src="@/assets/img/home/null_en.png">
        <p class="null-tip">{{$t('HISTORY.NOTHING')}}</p>
      </div>
      </template>
      <template v-else>
        <div class="loading-div">
          <Loading class="loading" color="#412aeb" size="24px" vertical><p>loading...</p></Loading>
        </div>
      </template>
    </div>
  </Dialog>
</template>
<script>
import { Loading } from 'vant'
import { mapState } from 'vuex'
import { formatWei } from '@/utils/Wallet.js'
import { play } from '@/utils/Wallet.js'
import Dialog from '@/components/common/Dialog'
import fecha from 'fecha'
import {getRecommendPerformance} from '@/utils/Invite.js'

export default {
  components: {
    Dialog,
    Loading
  },
  filters: {
    format: function(value, cropty) {
      if(isNaN(parseInt(value))){
        return value
      }
      if (cropty == CROPTY_MSI) {
        return accounting.accounting.formatNumber(value, 0)
      }
      if (value == 0) return 0
      return accounting.accounting.formatNumber(
        _.floor(Wallet.getInstance().formatWei(value), 2),
        2
      )
    },
    fee_format: function(value) {
      if (value == 0) return '-'
      return accounting.accounting.formatNumber(
        _.floor(Wallet.getInstance().formatWei(value), 6),
        6
      )
    },
    date: function(timestamp) {
      return fecha.format(
        timestamp * 1000,
        'YYYY/MM/DD HH:mm:ss'
      )
    },
    full_date: function(timestamp) {
      return fecha.format(
        timestamp * 1000,
        'YYYY/MM/DD HH:mm:ss'
      )
    },
    format_wei: function(amount) {
      return formatWei(amount)
    },
    time_ago: function(timestamp){
      TimeAgo.locale(en)
      const timeAgo = new TimeAgo('en-US')
      return timeAgo.format(timestamp* 1000)
    }
  },
  watch: {
    history_list: function() {
      this.is_loading = false
    },
  },
  computed: {
    all: {
      cache: false,
      get: function() {
        
        return _.concat(this.pending_history_list, this.history_list)
      }
    },
    ...mapState({
      pending_history_list: state => state.wallet.pending_history_list,
      history_list: state => state.wallet.history_list,
    })
  },
  data: function() {
    return {
      processing_page: 1,
      finish_page: 1,
      all_page: 1,
      per_page: 999999,
      is_loading: true,
    }
  },
  beforeDestroy: function(){

  },
  mounted: function() {

  },
  methods: {
    open: function() {
      this.$refs.dialog.open()
    },
    close: function() {
      this.$refs.dialog.close()
    },
    closed: function() {

    },
    getTxUrl: function(tx) {
      if(this.$i18n.locale == "zh-TW") {
        return (BUILD_TYPE == 'PROD' ? 'https://cn.etherscan.com/tx/' : 'https://ropsten.etherscan.io/tx/') + tx
      } else {
        return (BUILD_TYPE == 'PROD' ? 'https://etherscan.io/tx/' : 'https://ropsten.etherscan.io/tx/') + tx
      }
    },
  }
}
</script>
<style lang="scss"  src='@/assets/css/pages/dialog/history.scss' scoped></style>

