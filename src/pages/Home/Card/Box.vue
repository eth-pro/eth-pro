<template>
  <div id="box">
    <Card
      :title="$t('dialog.box.content_0')"
      :sub_title="$t('dialog.box.content_1')"
      icon="icon-1"
    >
      <div slot="content">
        <div class="content">
          <div class="block">
            <div class="block-summary">
              <div class="block-summary-item">
                
                <div class="amount" v-if="address == null">
                  --:--:--
                </div>
                <div class="amount" v-else>
                  <van-count-down :time="boxExpire" />
                </div>
                <div class="label">{{$t('dialog.box.content_2')}}</div>
              </div>
              <div class="block-summary-item">
                <div class="amount">{{boxPool | floor}}</div>
                <div class="label">{{$t('dialog.box.content_3')}}</div>
              </div>
            </div>
          </div>
          <div class="block">
            <van-list
              v-model="table1_loading"
              class="list"
              :finished="table1_finished"
              finished-text
              loading-text=" "
            >
              <table>
                <tr class="item header">
                  <th class="address">{{$t('dialog.box.content_5')}}</th>
                  <th class="amount">{{$t('dialog.box.content_6')}}</th>
                  <th class="reward">{{$t('dialog.box.content_7')}}</th>
                </tr>
                <tr class="item" v-for="(item, index) in table1_list" :key="index">
                  <td class="address">{{item.send | short_address}}</td>
                  <td class="amount">{{item.logtime | date('HH:mm:ss')}}</td>
                  <td class="reward">{{boxeward(index) | floor}}</td>
                </tr>
              </table>
            </van-list>
          </div>
          <div class="block">
            <div class="btn none" :class="{disable:disable}" @click="getBoxReward">{{$t('dialog.box.content_4')}}</div>
          </div>
          <div class="block">
            <div class="title"><img src="@/assets/img/home/icon-7.png" />{{$t('dialog.box.content_15')}}</div>
            <div class="block-summary">
              <div class="block-summary-item row">
                <div class="amount">{{distributePool | floor}} ETH</div>
                <div class="label">{{$t('dialog.box.content_8')}}</div>
              </div>
              <div class="block-summary-item">
                <div class="amount">{{reserve | floor}} ETH</div>
                <div class="label">{{$t('dialog.box.content_9')}}</div>
              </div>
              <div class="block-summary-item">
                <div class="amount">{{profitPool | floor}} ETH</div>
                <div class="label">{{$t('dialog.box.content_10')}}</div>
              </div>
              <div class="block-summary-item">
                <div class="amount">{{devFund | floor}} ETH</div>
                <div class="label">{{$t('dialog.box.content_11')}}</div>
              </div>
              <div class="block-summary-item">
                <div class="amount">{{top3Pool | floor}} ETH</div>
                <div class="label">{{$t('dialog.box.content_12')}}</div>
              </div>
              <div class="block-summary-item">
                <div class="amount">{{boxPool | floor}} ETH</div>
                <div class="label">{{$t('dialog.box.content_13')}}</div>
              </div>
              <div class="block-summary-item">
                <div class="amount">{{insuranceFund | floor}} ETH</div>
                <div class="label">{{$t('dialog.box.content_14')}}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { formatWei, getBoxReward } from "@/utils/Wallet.js";
import VueScrollTo from "vue-scrollto";
import Card from "@/components/common/Card";
import { LEVEL } from "@/config/wallet.js";
import accounting from "accounting";
import {getList4} from '@/utils/Invite.js'
import _ from "lodash";
import store from '@/store'

export default {
  name: "Box",
  components: {
    Card
  },
  data() {
    return {
      table1_list: [],
      table1_loading: true,
      table1_finished: false,
      timer: null,
    };
  },
  mounted() {
    this.timer = setInterval(() => {
      if(this.address != null){
        clearInterval(this.timer)
        const no = this.boxExpire == 0 || this.restartNo == 1 ? this.restartNo : this.restartNo - 1
        getList4(no).then((list) =>{
          this.table1_list = list
          this.table1_loading = false
          this.table1_finished = true
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
        return 0;
      }
      return accounting.accounting.formatNumber(
        _.floor(value, decimal),
        decimal
      );
    }
  },
  watch: {
  },
  computed: {
    disable: function(){
      return !(this.r8 > 0 && this.boxReward == 0)
    },
    invite_url: function() {
      return (
        document.location.protocol +
        "//" +
        document.location.hostname +
        "/?ref=" +
        this.invite_code
      );
    },
    ...mapState({
      address: state => state.wallet.address,
      restartNo: state => state.wallet.restartNo,
      totalInvestment: state => formatWei(state.wallet.totalInvestment),
      lastTotalInvestment: state => formatWei(state.wallet.lastTotalInvestment),
      lastSeriesNo: state => state.wallet.lastSeriesNo,
      boxLastSeriesNo: state => state.wallet.boxLastSeriesNo,
      r8: state => state.wallet.r8,
      boxReward: state => state.wallet.boxReward,
      boxPool: state => formatWei(state.wallet.boxPool),
      boxExpire: state =>
        parseInt(state.wallet.boxExpire * 1000) > Date.now()
          ? parseInt(state.wallet.boxExpire * 1000) - Date.now()
          : 0,
      distributePool: state => formatWei(state.wallet.distributePool),
      reserve: state => formatWei(state.wallet.reserve),
      profitPool: state => formatWei(state.wallet.profitPool),
      devFund: state => formatWei(state.wallet.devFund),
      top3Pool: state => formatWei(state.wallet.top3Pool),
      insuranceFund: state => formatWei(state.wallet.insuranceFund),
    })
  },
  methods: {
    onCopy: function() {
      this.$toast(this.$t("TOAST.COPY"));
    },
    boxeward(rank) { //计算应得宝箱奖励
      const current_investment  = this.boxExpire ==  0 || this.restartNo == 1 ? this.totalInvestment : this.lastTotalInvestment
      
      if (rank == 0){
        //return boxPool[curRoundNo]*25/100;
        return current_investment*2/100 *25/100;
      }
      else if(rank>=1 && rank<=5){
        //return boxPool[curRoundNo]*25/100/5;
        return current_investment*2/100 *25/100 /5;
      }
      else if(rank>=6 && rank<=55){
        //return boxPool[curRoundNo]*25/100/50;
        return current_investment*2/100 *25/100 /50;
      }
      else if(rank>=56 && rank<=555){
        //return boxPool[curRoundNo]*25/100/500;
        return current_investment*2/100 *25/100 /500;
      }
      return 0;
    },
    getBoxReward: function(){
      if(this.disable){
        return false
      }
      getBoxReward()
    }
  }
};
</script>

<style lang='scss' src='@/assets/css/pages/home/card/box.scss' scoped></style> 