<template>
  <div id="home">
    <div class="dashboard">
      <div class="graph">
        <div class="list">
          <div class="item">
            <div class="amount">
              <i class="flag color1"></i>
              <span>{{parseFloat(totalInvestment) * 0.85 + parseFloat(ethTax) | floor(1)}}</span>
            </div>
            <div class="label">
              {{$t('home.content_1')}}
            </div>
          </div>
          <div class="item">
            <div class="amount">
              <i class="flag color2"></i>
              <span>{{parseFloat(totalInvestment) * 0.05 | floor(1)}}</span>
            </div>
            <div class="label">
              {{$t('home.content_2')}}
            </div>
          </div>
          <div class="item">
            <div class="amount">
              <i class="flag color3"></i>
              <span>{{parseFloat(totalInvestment) * 0.04 | floor(1)}}</span>
            </div>
            <div class="label">
              {{$t('home.content_3')}}
            </div>
          </div>
        </div>
        <div id="container">
          <img src="@/assets/img/home/summary.png" />
          <div class="data">
            <div class="amount">{{totalInvestment | floor(0)}}</div>
            <div class="label">{{$t('home.content_7')}}(ETH)</div>
          </div>
        </div>
        <div class="list">
          <div class="item">
            <div class="amount">
              <span>{{parseFloat(totalInvestment) * 0.03 | floor(1)}}</span>
              <i class="flag color5"></i>
            </div>
            <div class="label">
              TOP3  3%
            </div>
          </div>
          <div class="item">
            <div class="amount">
              <span>{{parseFloat(totalInvestment) * 0.02 | floor(1)}}</span>
              <i class="flag color4"></i>
            </div>
            <div class="label">
              {{$t('home.content_5')}} 2%
            </div>
          </div>
          <div class="item">
            <div class="amount">
              <span>{{parseFloat(totalInvestment) * 0.01 | floor(1)}}</span>
              <i class="flag color6"></i>
            </div>
            <div class="label">
              {{$t('home.content_6')}} 1%
            </div>
          </div>
        </div>
      </div>
      <div class="coutdown">
        <div class="time" v-if="address == null">--:--:--</div>
        <div class="time" v-else><van-count-down :time="boxExpire" /></div>
        <div class="tip">{{$t('home.content_4')}}</div>
      </div>
    </div>
    <Join class="join" />
    <Popularize class="popularize" />
    <Record class="record" />
    <Box class="box" />
  </div>
</template>

<script>
import Highcharts from "highcharts";
import { mapState } from "vuex";
import { formatWei, toWei, distributionReward } from "@/utils/Wallet.js";
import {
  SET_REF_INVITE_CODE,
  SET_CHANNEL,
  SET_INCOME_DIALOG_SHOW,
  SET_REINVENT_DIALOG_SHOW
} from "@/store/mutation-types";
import Join from "@/pages/Home/Card/Join";
import Popularize from "@/pages/Home/Card/Popularize";
import Record from "@/pages/Home/Card/Record";
import Box from "@/pages/Home/Card/Box";

import accounting from "accounting";

import store from "../store";
export default {
  name: "Home",
  components: {
    Join,
    Popularize,
    Box,
    Record
  },
  async created() {},
  data() {
    return {
    };
  },
  mounted() {
    this.init();
  },
  filters: {
    floor: function(value, decimal = 2) {
      if(store.state.wallet.address == null){
        return '-'
      }
      if (value == 0) {
        return 0;
      }
      return _.floor(value, decimal);
    }
  },
  computed: {
    ...mapState({
      address: state => state.wallet.address,
      distributePool: state => formatWei(state.wallet.distributePool),
	  reserve: state => formatWei(state.wallet.reserve),
	  profitPool: state => formatWei(state.wallet.profitPool),
      top3Pool: state => formatWei(state.wallet.top3Pool),
      boxPool: state => formatWei(state.wallet.boxPool),
      insuranceFund: state => formatWei(state.wallet.insuranceFund),
      devFund: state => formatWei(state.wallet.devFund),
      totalInvestment: state => formatWei(state.wallet.totalInvestment),
      lastSeriesNo: state => formatWei(state.wallet.lastSeriesNo),
      restartNo: state => formatWei(state.wallet.restartNo),
      boxExpire: state => parseInt(state.wallet.boxExpire)*1000 > Date.now() ? parseInt(state.wallet.boxExpire)*1000 - Date.now() : 0,
      boxLastSeriesNo: state => formatWei(state.wallet.boxLastSeriesNo),
      ethTax: state => formatWei(state.wallet.ethTax),

      boxReward: state => state.wallet.boxReward 
    })
  },
  methods: {
    init: function() {
    }
  }
};
</script>

<style lang='scss' src='@/assets/css/pages/home.scss' scoped></style> 