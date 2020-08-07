<template>
  <div id="popularize">
    <Card :title="$t('dialog.popularize.content_0')" :sub_title="$t('dialog.popularize.content_1')" icon="icon-1">
      <div slot="content">
        <div class="content">
          <div class="block" v-if="investment > 0">
            <div class="title">{{$t('dialog.popularize.content_2')}}</div>
            <div class="invite">
              <input class="invite-url" :value="invite_url" disabled/>
              <div class="copy" v-clipboard:copy="invite_url" v-clipboard:success="onCopy">{{$t('dialog.popularize.content_3')}}</div>
            </div>
            
          </div>
          <div class="block">
            <div class="title">{{$t('dialog.popularize.content_4')}}</div>
            <div class="list">
              <div class="item">
                <div class="address">{{$t('dialog.popularize.content_5')}}</div>
                <div class="amount">{{$t('dialog.popularize.content_6')}}</div>
                <div class="reward">{{$t('dialog.popularize.content_7')}}</div>
              </div>
              <div class="item" v-if="invite_top1_address != '0x0000000000000000000000000000000000000000'">
                <div class="address">{{invite_top1_address | short_address}}</div>
                <div class="amount">{{invite_top1_total | floor}}</div>
                <div class="reward">{{invite_top1_reward | floor}}</div>
              </div>
              <div class="item" v-if="invite_top2_address != '0x0000000000000000000000000000000000000000'">
                <div class="address">{{invite_top2_address | short_address}}</div>
                <div class="amount">{{invite_top2_total | floor}}</div>
                <div class="reward">{{invite_top2_reward | floor}}</div>
              </div>
              <div class="item" v-if="invite_top3_address != '0x0000000000000000000000000000000000000000'">
                <div class="address">{{invite_top3_address | short_address}}</div>
                <div class="amount">{{invite_top3_total | floor}}</div>
                <div class="reward">{{invite_top3_reward | floor}}</div>
              </div>
              <div class="item my">
                <div class="address">{{address | short_address}}</div>
                <div class="amount">{{sonAmount | floor}}</div>
                <div class="reward">{{top3_last_reward | floor}}</div>
              </div>
            </div>
          </div>
          <div class="btn none" :class="{disable:disable}" @click="getTop3Reward">{{$t('dialog.popularize.content_8')}}</div>
        </div>
      </div>
    </Card>
    <Reward ref='reward'/>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Reward from '@/pages/Dialog/Reward'
import { formatWei, getTop3Reward } from '@/utils/Wallet.js'
import VueScrollTo from 'vue-scrollto'
import Card from '@/components/common/Card'
import { LEVEL } from '@/config/wallet.js'
import accounting from 'accounting'
import _ from 'lodash'
import store from '@/store'

export default {
  name: 'Popularize',
  components: {
    Card,
    Reward
  },
  created() {
  },
  data() {
    return {
      
    }
  },
  mounted() {

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
  watch: {

  },
  computed: {
    state: function() {
      if(this.reinvestmentable == 1){
        return 1
      }

      if(this.level == 0){
        return 0
      }
      return 2
    },
    disable: function() {
      return !(this.top3_last_reward > 0)
    },
    performance_detail_string: function() {
      let performance_detail_arr = []
      let performance_detail = this.performance_detail

      for (let i = 0; i < performance_detail.length; i++) {
        if (performance_detail[i] > 0) {
          performance_detail_arr.push(performance_detail[i] + " " + LEVEL[i].toUpperCase())
        }
      }
      return performance_detail_arr.length > 0 ? performance_detail_arr.join('+') : '0 ' + LEVEL[2].toUpperCase()
    },
    invite_url: function() {
      return encodeURI(document.location.protocol + '//' +  document.location.host + "/?ref=" + window.btoa(this.address))
    },
    ...mapState({
      investment: state => formatWei(state.wallet.investment),
      invite_top1_address: state => state.wallet.invite_top1_address,
      invite_top1_total: state => formatWei(state.wallet.invite_top1_total),
      invite_top1_reward: state => formatWei(state.wallet.invite_top1_reward),

      invite_top2_address: state => state.wallet.invite_top2_address,
      invite_top2_total: state => formatWei(state.wallet.invite_top2_total),
      invite_top2_reward: state => formatWei(state.wallet.invite_top2_reward),

      invite_top3_address: state => state.wallet.invite_top3_address,
      invite_top3_total: state => formatWei(state.wallet.invite_top3_total),
      invite_top3_reward: state => formatWei(state.wallet.invite_top3_reward),

      sonAmount: state => formatWei(state.wallet.sonAmount),
      sonAmountPre: state => formatWei(state.wallet.sonAmountPre),
      sonAmountDate: state => state.wallet.sonAmountDate,
      
      address: state => state.wallet.address,

      top3_last_reward: state => formatWei(state.wallet.top3_last_reward),
      top3_is_get: state => state.wallet.top3_is_get,
    })
  },
  methods: {
    onCopy: function() {
      this.$toast(this.$t('TOAST.COPY'))
    },
    join: function(){
      VueScrollTo.scrollTo('#join', 300, {
        offset: -80,
      })
    },
    getTop3Reward: function() {
      if(this.disable){
        return false
      }
      getTop3Reward()
    }
  }
}
</script>

<style lang='scss' src='@/assets/css/pages/home/card/popularize.scss' scoped></style> 