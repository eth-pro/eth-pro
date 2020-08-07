<template>
  <div id="dashboard">
    <div class="chart">
      <div class="detail">
        <div class="price">
          <span>{{last_price | floor(4)}}</span>
          <br />EPRO/ETH
        </div>
        <div class="increase" v-if="$store.state.wallet.address == null">
          <span>-%</span>
          <br />{{$t('dialog.dashboard.content_0')}}
        </div>
        <div class="increase" v-else>
          <span>{{increase_format >= 0 ? ('+' + increase_format) : increase_format}}%</span>
          <br />{{$t('dialog.dashboard.content_0')}}
        </div>
        <div class="seven-increase" v-if="$store.state.wallet.address == null">
          <span>-%</span>
          <br />{{$t('dialog.dashboard.content_1')}}
        </div>
        <div class="seven-increase" v-else>
          <span>{{increase_serven_format >= 0 ? ('+' + increase_serven_format) : increase_serven_format}}%</span>
          <br />{{$t('dialog.dashboard.content_1')}}
        </div>
      </div>
      <div id="chart-content" class="content"></div>
      <div class="tip">
        <div>{{$t('dialog.dashboard.content_3')}}:0.01</div>
        <div>{{$t('dialog.dashboard.content_2')}}:{{max_price | floor}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import Highcharts from "highcharts";
import Data from "@/api/Data";
import fecha from "fecha";
import accounting from "accounting";
import { mapState } from "vuex";
import Statistic from "@/utils/Statistic";
import { formatWei, toWei } from "@/utils/Wallet.js";
import store from '@/store'
export default {
  components: {},
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
  async mounted() {
    try {
      this.init();
      this.update_timer = setInterval(() => {
        this.update();
      }, 5 * 1000);
    } catch (e) {
      console.log(e);
    }
  },
  computed: {
    increase: function() { return this.price_24h == 0 ? 0 : (this.last_price - this.price_24h) / this.price_24h},
    increase7_day: function(){ return this.price_7days == 0 ? 0 : (this.last_price - this.price_7days) / this.price_7days},
    last_update_date: function() {
      if (isNaN(parseInt(this.last_update))) {
        return this.last_update;
      }
      return this.last_update > 0
        ? fecha.format(this.last_update, "YYYY-MM-DD HH:mm:ss")
        : "-";
    },
    increase_format: function() {
      if (isNaN(parseInt(this.increase))) {
        return this.increase;
      }
      return this.increase == 0
        ? '-'
        : (this.increase * 100).toFixed(2);
    },
    increase_serven_format: function() {
      if (isNaN(parseInt(this.increase7_day))) {
        return this.increase7_day;
      }
      return this.increase7_day == 0
        ? '-'
        : (this.increase7_day * 100).toFixed(2);
    },
    ...mapState({
      rate: state => state.base.rate,
      chart_data: state => state.statistic.chart_data,
      price_24h: state => state.statistic.price_24h,
      price_7days: state => state.statistic.price_7days,
      last_price: state => formatWei(state.wallet.price),
      last_update: state => state.statistic.last_update,
      max_price: state => state.statistic.max_price,
      min_price: state => state.statistic.min_price,
    })
  },
  data() {
    return {
      chart: null,
      update_timer: null
    };
  },
  created() {
    Statistic.getInstance().init();
  },
  beforeDestroy() {
    clearInterval(this.update_timer);
  },
  methods: {
    init: function() {
      Highcharts.setOptions({ global: { useUTC: false } });
      this.chart = Highcharts.chart("chart-content", {
        chart: {
          spacing: [10, 0, 15, 0],
          backgroundColor: 'rgba(0,0,0,0)'
        },
        title: {
          text: null
        },
        subtitle: {
          text: null
        },
        xAxis: {
          type: "datetime",
          tickInterval: 24 * 3600 * 1000,
          tickPosition: "inside",
          dateTimeLabelFormats: {
            millisecond: "%H:00:00",
            second: "%H:00",
            minute: "%H:00",
            hour: "%H:00",
            day: "%m-%d",
            week: "%m-%d",
            month: "%Y-%m",
            year: "%Y"
          },
          lineColor: 'rgba(255,255,255,0.1)',
        },
        tooltip: {
          dateTimeLabelFormats: {
            millisecond: "%Y-%m-%d %H:00",
            second: "%Y-%m-%d %H:00",
            minute: "%Y-%m-%d %H:00",
            hour: "%Y-%m-%d %H:%M",
            day: "%Y-%m-%d",
            week: "%m-%d",
            month: "%Y-%m",
            year: "%Y"
          }
        },
        yAxis: {
          title: {
            text: null,
          },
          min: 0,
          gridLineColor: 'rgba(255,255,255,0.1)',
          opposite: true,
          labels: {
            formatter: function() {
              return _.floor(this.value, 3).toFixed(3);
            }
          },
          minRange: 0.001
        },
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        plotOptions: {
          area: {
            color: '#1b7bff',
            fillColor: {
              linearGradient: [0, 0, 0, 0.1],
              stops: [
					      [0, 'rgba(27,123,255,1)'],
					      [1, 'rgba(27,123,255,0)']
				      ]
            },
            fillOpacity: 0.3,
            marker: {
              radius: 0
            },
            lineWidth: 2,
            states: {
              hover: {
                lineWidth: 1
              }
            },
            threshold: null
          }
        },
        series: [
          {
            type: "area",
            name: "EPRO",
            data: this.chart_data
          }
        ]
      });
    },
    update: async function() {
      try {
        this.chart.series[0].update({
          data: this.chart_data
        });
      } catch (e) {
        console.log(e);
      }
    }
  }
};
</script>
<style lang="scss"  src='@/assets/css/pages/epro/dashboard.scss' scoped></style>