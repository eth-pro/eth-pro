
<template>
  <Dialog id="reward" ref="dialog" @closed="closed" :closeable="true">
    <div slot="content" class="content">
      <h3>{{$t('REWARD.TITLE')}}</h3>
      <template v-if="!is_loading">
        <template v-if="list.length > 0">
          <div class="subtitle">
            <span class="left">{{$t('REWARD.NUMBER')}}</span>
            <span class="middle">{{$t('REWARD.ADDRESS')}}</span>
            <span class="right">{{$t('REWARD.RELATIONSHIP')}}</span>
          </div>
          <div class="items">
            <div class="item" v-for="(item,index) in list" :key="index">
              <p class="row0">
                <span class="left">{{item.investment | floor}}ETH</span>
                <span class="middle">{{item.rel_address | short_address}}</span>
                <span class="right">
                  {{$t('REWARD.RELATION')}}
                  <a target="_blank" :href="getTxUrl(item.hash)">
                    <img src="@/assets/img/home/collapse_arrow.png">
                  </a>
                </span>
              </p>
              <p class="row1">
                {{item.timestamp | date("MM/DD HH:mm:ss")}}
              </p>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="null">
            <img class="null-img" v-if="$i18n.locale == 'zh-TW'" src="@/assets/img/home/null.png">
            <img class="null-img" v-else src="@/assets/img/home/null_en.png">
            <p class="null-tip">{{$t('REWARD.NOTHING')}}</p>
          </div>
        </template>
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
import Dialog from '@/components/common/Dialog'
import {mapState} from 'vuex'
import { formatWei } from '@/utils/Wallet.js';
import {getRecommendPerformance} from '@/utils/Invite.js'

export default {
  components: {
    Dialog,
    Loading,
  },
  data(){
    return {
      resolve: null,
      is_loading: true,
      list: []
    }
  },
  computed: {
    ...mapState({
      level: state => state.wallet.level,
      static_profiting: state => formatWei(state.wallet.static_profiting),
      max_profit: state => formatWei(state.wallet.max_profit),
      address: state => state.wallet.address,
    })
  },
  methods: {
    getTxUrl: function(tx) {
      if(this.$i18n.locale == "zh-TW") {
        return (BUILD_TYPE == 'PROD' ? 'https://cn.etherscan.com/tx/' : 'https://ropsten.etherscan.io/tx/') + tx
      } else {
        return (BUILD_TYPE == 'PROD' ? 'https://etherscan.io/tx/' : 'https://ropsten.etherscan.io/tx/') + tx
      }
    },
    open: function() {
      this.$refs.dialog.open()
      getRecommendPerformance(this.address).then(data => {
        this.list = data
        this.is_loading = false
      })
      return new Promise((resolve) => {
        this.resolve = resolve
      })
    },
    close: function() {
      this.$refs.dialog.close()
    },
    closed: function() {
      this.resolve()
    },
    confirm: function(){

    }
  }
}
</script>
<style lang="scss"  src='@/assets/css/pages/dialog/reward.scss' scoped></style>