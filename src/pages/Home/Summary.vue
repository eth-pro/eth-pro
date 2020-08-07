<template>
  <div id="summary">
    <section v-show="!chart_loading">
      <table class="table0">
        <tr>
          <td>
            <div class="price">
              <span class="number"><ICountUp :endVal="truncation(formula_price, 8)" :options="{decimalPlaces: 8}"/></span>
            </div>
          </td>
          <td>
            <div class="increase">
              <span class="number" :class="{up : truncation(increase_format, 2) >= 0}">{{truncation(increase_format, 2) >= 0 ? '+': ''}}<ICountUp :endVal="truncation(increase_format, 2)" :options="{decimalPlaces: 2}"/>%</span>
            </div>
          </td>
          <td>
            <div class="increase">
              <span class="number" :class="{up : truncation(increase_serven_format, 2) >= 0}">{{truncation(increase_serven_format, 2) >= 0 ? '+' : ''}}<ICountUp :endVal="truncation(increase_serven_format, 2)" :options="{decimalPlaces: 2}"/>%</span>
            </div>
          </td>
          <td></td>
        </tr>
        <tr>
          <td>
            <span>{{$t('TREND.LEFT.PRICE')}}(ETH)</span>
          </td>
          <td>
            <span>{{$t('TREND.LEFT.GAIN')}}</span>
          </td>
          <td>
            <span>{{$t('TREND.LEFT.GAIN7')}}</span>
          </td>
        </tr>
      </table>
      <div class="content-div">
        <div id='chart-content' class="content"></div>
      </div>
      <table class="table1">
        <tr>
          <td>
            <span>{{$t('TREND.RIGHT.PRICE')}}</span>
            <span class="number"><ICountUp :endVal="truncation(exchange_last_price, 8)" :options="{decimalPlaces: 8}"/>ETH</span>
          </td>
          <td>
            <span>{{$t('TREND.RIGHT.VOLUME')}}</span>
            <span class="number"><ICountUp :endVal="truncation(exchange_vol_24h, 2)" :options="{decimalPlaces: 2}"/>ETH</span>
          </td>
        </tr>
        <tr>
          <td>
            <span>{{$t('TREND.RIGHT.UPDATED')}}</span>
            <span>{{last_update_date}}</span>
          </td>
          <td>
            <span>{{$t('TREND.RIGHT.EXCHANGE')}}</span>
            <a href="https://coinx.exchange" target="_blank"> coinx.exchange</a>
          </td>
        </tr>
      </table>
    </section>
    <section v-show="chart_loading">
      <content-placeholders class="skeleton" :rounded="true">
        <table class="table0">
        <tr>
          <td>
            <div class="price">
              <div class="label"><content-placeholders-text :lines="1" /></div>
            </div>
          </td>
          <td>
            <div class="increase">
              <div class="label"><content-placeholders-text :lines="1" /></div>
            </div>
          </td>
          <td>
            <div class="increase">
              <div class="label"><content-placeholders-text :lines="1" /></div>
            </div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="label"><content-placeholders-text :lines="1" /></div>
          </td>
          <td>
            <div class="label"><content-placeholders-text :lines="1" /></div>
          </td>
          <td>
            <div class="label"><content-placeholders-text :lines="1" /></div>
          </td>
        </tr>
      </table>
      <div class="content-div">
        <content-placeholders :animated="false" class="skeleton">
          <content-placeholders-img />
        </content-placeholders>
      </div>
      <table class="table1">
        <tr>
          <td>
            <div class="label"><content-placeholders-text :lines="1" /></div>
            <div class="label"><content-placeholders-text :lines="1" /></div>
          </td>
          <td>
            <div class="label"><content-placeholders-text :lines="1" /></div>
            <div class="label"><content-placeholders-text :lines="1" /></div>
          </td>
        </tr>
        <tr>
          <td>
            <div class="label"><content-placeholders-text :lines="1" /></div>
            <div class="label"><content-placeholders-text :lines="1" /></div>
          </td>
          <td>
            <div class="label"><content-placeholders-text :lines="1" /></div>
            <div class="label"><content-placeholders-text :lines="1" /></div>
          </td>
        </tr>
      </table>
      </content-placeholders>
    </section>
    <div class="loading-div" v-if="chart_loading">
      <div class="loading-div-div">
        <van-loading class="loading" color="#412aeb" size="24px" vertical/><p>loading...</p></van-loading>
      </div>
    </div>
    
  </div>
</template>
<script>
import { Tab, Tabs } from 'vant'
import Title from '@/components/common/Title'
import Highcharts from 'Highcharts'
import { mapState } from 'vuex'
import Data from '@/api/Data'
import fecha from 'fecha'
import accounting from 'accounting'
import ICountUp from 'vue-countup-v2'
import Statistic from '@/utils/Statistic'
import _ from 'lodash'
import {polyfitLine } from '@/utils/Polyfit'

export default {
  name: 'Summary',
  components: {
    Title,
    ICountUp,
    [Tab.name]: Tab,
    [Tabs.name]: Tabs
  },
  filters: {
    floor: function(value) {
      if (value == 0) {
        return 0
      }
      return accounting.accounting.formatNumber(_.floor(value, 2), 2)
    },
    truncation: function(value) {
      if (value == 0) {
        return 0
      }
      return _.floor(value, 2)
    }
  },
  async mounted() {
    try {
      this.init()
      this.update_timer = setInterval(() => {
        this.update()
      }, 5 * 1000)
    } catch (e) {
      console.log(e)
    }
  },
  computed: {
    last_update_date: function() {
      if (isNaN(parseInt(this.last_update))) {
        return this.last_update
      }
      return this.last_update > 0
        ? fecha.format(this.last_update, 'YYYY-MM-DD HH:mm:ss')
        : '-'
    },
    increase_format: function() {
      if (isNaN(parseInt(this.block_increase))) {
        return this.block_increase
      }
      return this.block_increase == 0
        ? 0
        : (this.block_increase * 100).toFixed(2)
    },
    increase_serven_format: function() {
      if (isNaN(parseInt(this.block_increase7_day))) {
        return this.block_increase7_day
      }
      return this.block_increase7_day == 0
        ? 0
        : (this.block_increase7_day * 100).toFixed(2)
    },
    new_price: function() {
      return _.floor(1 / this.last_price, 8)
    },
    chart_loading: function() {
      if(this.last_update + 4 * 86400 * 1000 <= Date.now()){
        return true
      }
      return false
    },
    poly_chart_data: function() {
      return polyfitLine(this.chart_data, this.last_price)
    },
    poly_exchange_chart_data: function() {
      return polyfitLine(this.exchange_chart_data, this.exchange_last_price)
    },
    plot_bands_from: function() {
      const poly = this.poly_chart_data[0][0]
      return poly
      if(poly < exchange) {
        return poly
      } else {
        return exchange
      }
    },
    plot_bands_to: function() {
      const poly = this.poly_chart_data[this.poly_chart_data.length - 1][0]
      return poly
      if(poly > exchange) {
        return poly
      } else {
        return exchange
      }
    },
    plot_bands_number: function() {
      const poly = this.poly_chart_data.length
      const exchange = this.poly_exchange_chart_data.length

      if(poly > exchange) {
        return poly
      } else {
        return exchange
      }
    },
    ...mapState({
      rate: state => state.base.rate,
      chart_data: state => state.statistic.chart_data,
      exchange_chart_data: state => state.statistic.exchange_chart_data,
      last_price: state => state.statistic.last_price,
      formula_price: state => state.base.formula_price,
      block_increase: state => state.statistic.block_increase,
      block_increase7_day: state => state.statistic.block_increase7_day,
      exchange_vol_24h: state => state.statistic.exchange_vol_24h,
      last_update: state => parseInt(state.statistic.last_update),
      exchange_last_price: state => state.statistic.exchange_last_price
    })
  },
  watch: {
    '$i18n.locale': function(){
      this.update()
    }
  },
  data() {
    return {
    	ms_price: '-',
      active: 2,
      chart: null,
      update_timer: null,
      chart_loading_time: 0,
    }
  },
  created() {
    Statistic.getInstance().init()
  },
  beforeDestroy() {
    clearInterval(this.update_timer)
  },
  methods: {
    init: function() {
      Highcharts.setOptions({ global: { useUTC: false } })
      this.chart = Highcharts.chart('chart-content', {
        chart: {
          type: 'spline'
        },
        title: {
          text: null
        },
        subtitle: {
          text: null
        },
        global: {
          useUTC: true
        },
        xAxis: {
          type: 'datetime',
          tickInterval: 24 * 3600 * 1000,
          tickPosition: 'inside',
          dateTimeLabelFormats: {
            millisecond: '%H:%M:00',
            second: '%H:%M',
            minute: '%H:%M',
            hour: '%H:%M',
            day: '%m-%d',
            week: '%m-%d',
            month: '%Y-%m',
            year: '%Y'
          }
        },
        tooltip: {
          dateTimeLabelFormats: {
            millisecond: '%Y-%m-%d %H:00',
            second: '%Y-%m-%d %H:%M',
            minute: '%Y-%m-%d %H:%M',
            hour: '%Y-%m-%d %H:%M',
            day: '%Y-%m-%d',
            week: '%m-%d',
            month: '%Y-%m',
            year: '%Y'
          }
        },
        yAxis: {
          title: {
            text: null
          },
          labels: {
            formatter: function() {
              return _.floor(this.value, 8).toFixed(8)
            }
          },
          opposite: true,
          minRange: 0.00000001,
        },
        legend: {
          enabled: false
        },
        credits: {
          enabled: false
        },
        tooltip: {
          crosshairs: true,
          shared: true
        },
        plotOptions: {
            spline: {
                marker: {
                    radius: 4,
                    lineColor: '#666666',
                    lineWidth: 1
                },
                tooltip: {
                  dateTimeLabelFormats: {
                    millisecond: '%Y-%m-%d %H:00',
                    second: '%Y-%m-%d %H:%M',
                    minute: '%Y-%m-%d %H:%M',
                    hour: '%Y-%m-%d %H:%M',
                    day: '%Y-%m-%d',
                    week: '%m-%d',
                    month: '%Y-%m',
                    year: '%Y'
                  }
                },
            }
        },
        series: [
          {
            type: 'spline',
            name: this.$t('TREND.CHART_TIP'),
            color: '#412aeb',
            data: this.poly_chart_data.length >= 2 ? _.concat(this.chart_data, this.poly_chart_data) : this.chart_data
          },
          {
            type: 'spline',
            name: this.$t('TREND.EXCHANGE_CHART_TIP'),
            color: '#f39800',
            data: this.poly_exchange_chart_data.length >= 2 ? _.concat(this.exchange_chart_data, this.poly_exchange_chart_data): this.exchange_chart_data
          }
        ]
      })

      if(this.plot_bands_number >= 2) {
        this.chart.xAxis[0].update({
          plotBands: [{
            color: 'rgba(0, 0, 0, 0.1)',
            from: this.plot_bands_from,
				    to: this.plot_bands_to,
            label: {
              text: this.$t('TREND.PLOTBANDS'),
              align: 'right',
              verticalAlign: 'bottom',
              style: {
                color: '#a9aaab',
                fontSize: '12px'
              },
              x: -10,
              y: -40
            },
            zIndex: 99
          }],
        })
      }
    },
    truncation: function(value, digit) {
      value = parseFloat(value)
      if (value == 0) {
        return 0
      }
      return _.floor(value, digit)
    },
    update: async function() {
      try {
        if(this.plot_bands_number >= 2) {
          this.chart.series[0].update({
            name: this.$t('TREND.CHART_TIP'),
            data: this.poly_chart_data.length >= 2 ? _.concat(this.chart_data, this.poly_chart_data) : this.chart_data
          })

          this.chart.series[1].update({
            name: this.$t('TREND.EXCHANGE_CHART_TIP'),
            data: this.poly_exchange_chart_data.length >= 2 ? _.concat(this.exchange_chart_data, this.poly_exchange_chart_data): this.exchange_chart_data
          })

          this.chart.xAxis[0].update({
            plotBands: [{
              color: 'rgba(0, 0, 0, 0.1)',
              from: this.plot_bands_from,
              to: this.plot_bands_to,
              label: {
                text: this.$t('TREND.PLOTBANDS'),
                align: 'right',
                verticalAlign: 'bottom',
                style: {
                  color: '#a9aaab',
                  fontSize: '12px'
                },
                x: -10,
                y: -40
              },
              zIndex: 99
            }],
          })
          
        } else {
          this.chart.series[0].update({
            name: this.$t('TREND.CHART_TIP'),
            data: this.chart_data
          })

          this.chart.series[1].update({
            name: this.$t('TREND.EXCHANGE_CHART_TIP'),
            data: this.exchange_chart_data
          })

          this.chart.xAxis[0].update({
            plotBands: [{
              color: '#fff',
              from: 0,
              to: 0,
              label: {
                text: '',
                align: 'right',
                verticalAlign: 'bottom',
                style: {
                  color: '#a9aaab',
                  fontSize: '12px'
                },
                x: -10,
                y: -40
              },
              zIndex: 99
            }],
          })
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
<style lang="scss"  src='@/assets/css/pages/home/summary.scss' scoped></style>