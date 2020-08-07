<template>
  <div id="record">
    <Card :title="$t('dialog.record.content_0')" :sub_title="$t('dialog.record.content_1')" icon="icon-1">
      <div slot="content">
        <div class="content">
          <div class="block">
            <div class="left">
              <div class="row">
                <div class="label">{{$t('dialog.record.content_2')}}:</div>
                <div class="value">{{investment | floor}}</div>
              </div>
              <div class="row">
                <div class="label">{{$t('dialog.record.content_3')}}:</div>
                <div class="value">{{subCoin | floor}}</div>
              </div>
              <div class="row">
                <div class="label">{{$t('dialog.record.content_4')}}:</div>
                <div class="value">{{r5 | floor}}</div>
              </div>
              <div class="row">
                <div class="label">{{$t('dialog.record.content_5')}}:</div>
                <div class="value">{{r6 | floor}}</div>
              </div>
              <div class="row">
                <div class="label">{{$t('dialog.record.content_6')}}:</div>
                <div class="value">{{ethDone | floor}}</div>
              </div>
            </div>
            <div class="right">
              <div class="row">
                <div class="label">{{$t('dialog.record.content_8')}}:</div>
                <div class="value">{{level}}</div>
              </div>
              <div class="row">
                <div class="label">{{$t('dialog.record.content_7')}}:</div>
                <div class="value">{{r3 | floor}}</div>
              </div>
              <div class="row">
                <div class="label">{{$t('dialog.record.content_9')}}:</div>
                <div class="value">{{r2 | floor}}</div>
              </div>
              <div class="row">
                <div class="label">{{$t('dialog.record.content_10')}}:</div>
                <div class="value">{{r1 | floor}}</div>
              </div>
              <div class="row">
                <div class="label">{{$t('dialog.record.content_11')}}:</div>
                <div class="value">{{r7 | floor}}</div>
              </div>
            </div>
          </div>
          <div class="block">
            <div class="count-down-box">
              <div class="count-down-box-bg" :style="'width:' + (1 - count_down/(7*3600*24*1000)) * 100 +'%'"></div>
              <div class="count-down-box-content"  v-if="address == null">{{$t('dialog.record.content_30')}} --:--:-- </div>
              <div class="count-down-box-content"  v-else>{{$t('dialog.record.content_30')}} <van-count-down class="count-down" :time="count_down" /> </div>
            </div>
          </div>
          <div class="block">
            <div class="balance" v-if="is_over">{{$t('dialog.record.content_12')}}：<span :class="{red:is_over}">{{0 | floor}} ({{$t('dialog.record.content_31')}})</span></div>
            <div class="balance" v-else>{{$t('dialog.record.content_12')}}：<span>{{r4 | floor(4)}}</span></div>
          </div>
          <div class="btn none" @click="distributionReward">{{$t('dialog.record.content_13')}}</div>
          <div class="block">
            <van-tabs type="card" class="tabs" background="#1e2234" color="#6722ff" title-active-color="#fff" title-inactive-color="#fff">
              <van-tab :title="$t('dialog.record.content_14')">
                <van-list
                  v-model="table1_loading"
                  class="list"
                  :finished="table1_finished"
                  loading-text=" "
                  finished-text=""
                >
                <table>
                  <tr class="item header">
                    <th class="address">{{$t('dialog.record.content_15')}}</th>
                    <th class="amount">{{$t('dialog.record.content_16')}}</th>
                    <th class="reward">{{$t('dialog.record.content_17')}}</th>
                  </tr>
                  <tr class="item" v-for="(item, index) in table1_list" :key="index">
                    <td class="address">{{item.send | short_address}}</td>
                    <td class="amount">{{item.logtime | date('HH:mm:ss')}}</td>
                    <td class="reward">{{item.amount | floor(0)}}</td>
                  </tr>
                </table>
                </van-list>
              </van-tab>
              <van-tab :title="$t('dialog.record.content_18')">
                <van-list
                  v-model="table2_loading"
                  class="list"
                  :finished="table2_finished"
                  loading-text=" "
                  finished-text=""
                >
                <table>
                  <tr class="item header">
                    <th class="address">{{$t('dialog.record.content_19')}}</th>
                    <th class="amount">{{$t('dialog.record.content_20')}}</th>
                    <th class="reward">{{$t('dialog.record.content_21')}}</th>
                  </tr>
                  <tr class="item my">
                    <td class="address">{{address | short_address}}</td>
                    <td class="amount">{{my.sonAmount | floor}}</td>
                    <td class="reward">{{my.top3_last_reward | floor}}</td>
                  </tr>
                  <tr class="item" v-for="(item, index) in table2_list" :key="index">
                    <td class="address">{{item.addr | short_address}}</td>
                    <td class="amount">{{item.invitAmount | floor}}</td>
                    <td class="reward">{{item.profitAmount | floor}}</td>
                  </tr>
                </table>
                </van-list>
              </van-tab>
              <van-tab :title="$t('dialog.record.content_22')">
                <van-list
                  v-model="table3_loading"
                  class="list"
                  :finished="table3_finished"
                  loading-text=" "
                  finished-text=""
                >
                <table class="large-table">
                  <tr class="item header">
                    <th class="address">{{$t('dialog.record.content_23')}}</th>
                    <th class="amount">{{$t('dialog.record.content_24')}}</th>
                    <!--th class="amount">{{$t('dialog.record.content_25')}}</th-->
                    <!--th class="amount">{{$t('dialog.record.content_26')}}</th-->
                    <th class="reward">{{$t('dialog.record.content_27')}}</th>
                    <th class="reward">{{$t('dialog.record.content_28')}}</th>
                    <th class="amount">{{$t('dialog.record.content_29')}}</th>
                  </tr>
                  <tr class="item" v-for="(item, index) in table3_list" :key="index">
                    <td class="address">{{item.addr | short_address}}</td>
                    <td class="amount">{{item.sonCount}}</td>
                    <!--td class="amount">{{item.nodeCount}}</td-->
                    <!--td class="amount">{{item.supNodeCount}}</td-->
                    <td class="reward">{{item.investment | floor}}</td>
                    <td class="reward">{{item.invitAmount | floor}}</td>
                    <td class="amount">{{item.firstTime | date}}</td>
                  </tr>
                </table>
                </van-list>
              </van-tab>
            </van-tabs>
          </div>
        </div>
      </div>
    </Card>
    <Reward ref='reward'/>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import Reward from '@/pages/Dialog/Reward'
import { formatWei, distributionReward, getAddress } from '@/utils/Wallet.js'
import VueScrollTo from 'vue-scrollto'
import Card from '@/components/common/Card'
import { LEVEL } from '@/config/wallet.js'
import accounting from 'accounting'
import {getList1, getList2, getList3} from '@/utils/Invite.js'
import _ from 'lodash'
import store from '@/store'

export default {
  name: 'Record',
  components: {
    Card,
    Reward
  },
  created() {
  },
  data() {
    return {
      table1_list: [],
      table1_loading: true,
      table1_finished: false,

      table2_list: [],
      table2_loading: true,
      table2_finished: false,

      table3_list: [],
      table3_loading: true,
      table3_finished: false,

      timer: null,

    }
  },
  mounted() {
    this.timer = setInterval(() => {
      if(this.address != null){
        clearInterval(this.timer)
        Promise.all([
        getList1().then((list) =>{
          this.table1_list = list
          this.table1_loading = false
          this.table1_finished = true
        }),

        getList2().then((list) =>{
          this.table2_list = list
          this.table2_loading = false
          this.table2_finished = true
        }),

        getList3().then((list) =>{
          this.table3_list = list
          this.table3_loading = false
          this.table3_finished = true
        })
        ]).then(() => {
          console.log('加载成功')
        })
      }
    },300)

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
    is_over: function(){
      return this.ethDone > 0 && this.ethDone >= this.investment * 125/100
    },
    my: function() {
      if(this.address == null){
        return {
          sonAmount: 0,
          top3_last_reward: 0
        }
      }
      let index = -1
      this.table2_list.map((item,i) => {
        if(item.addr.toLowerCase() == this.address.toLowerCase()){
          index = i
        }
      })
      if(index == -1){
        return {
          sonAmount: this.sonAmount,
          top3_last_reward: this.r10
        }
      }else{
        return {
          sonAmount: this.table2_list[index].invitAmount,
          top3_last_reward: this.table2_list[index].profitAmount
        }
      }
    },
    count_down: function() {
      const left = parseInt(this.distributeLastTime * 1000) + 7 * 24 * 3600 * 1000 - Date.now()
      return left > 0 ? left : 0
    },
    state: function() {
      if(this.reinvestmentable == 1){
        return 1
      }

      if(this.level == 0){
        return 0
      }
      return 2
    },
    level: function(){
      if(this.sonNodeCount >= 9){
        return this.$t('dialog.record.content_32')
      }else if(this.sonCount >= 9){
        return this.$t('dialog.record.content_33')
      }else if(this.investment >= 1){
        return this.$t('dialog.record.content_34')
      }else {
        return ''
      }
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
      return document.location.protocol + '//' +  document.location.hostname + "/?ref=" + this.invite_code
    },
    ...mapState({
      address: state => state.wallet.address, 
      investment: state => formatWei(state.wallet.investment), 
      subCoin: state => formatWei(state.wallet.subCoin),
      eth: state => formatWei(state.wallet.eth),
      ethDone: state => formatWei(state.wallet.ethDone), 
      sonCount: state => state.wallet.sonCount, 
      sonNodeCount: state => state.wallet.sonNodeCount,
      sonAmount: state => formatWei(state.wallet.sonAmount),
      distributeLastTime: state => state.wallet.distributeLastTime,
      top3_last_reward: state => formatWei(state.wallet.top3_last_reward),

      r0: state => formatWei(state.wallet.r0), 
      r1: state => formatWei(state.wallet.r1), 
      r2: state => formatWei(state.wallet.r2), 
      r3: state => formatWei(state.wallet.r3),
      r4: state => formatWei(state.wallet.r4), 
      r5: state => formatWei(state.wallet.r5), 
      r6: state => formatWei(state.wallet.r6), 
      r7: state => formatWei(state.wallet.r7), 

      r10: state => formatWei(state.wallet.r10),

      distributeLastTime: state => state.wallet.distributeLastTime,
    })
  },
  methods: {
    distributionReward,
  }
}
</script>

<style lang='scss' src='@/assets/css/pages/home/card/record.scss' scoped></style> 