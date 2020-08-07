<template>
  <div id="join">
    <Card :title="$t('dialog.join.content_0')" :sub_title="$t('dialog.join.content_1')" icon="icon-4"
     :msg="$t('JOIN.MSG')">
      <div slot="content">
        <div class="content">
            <div class="btn-group">
              <van-slider class="slider" v-model="input_amount" :min='1' :max='99' />
            </div>
            <div class="counter">
              <div class="minus" @click="minus">-</div>
              <div class="input-box">
                <div class="input label">
                  <input type="number" step="1" v-model="input_amount" @input="onChange" :placeholder="$t('dialog.join.content_5')"/>
                </div>
              </div>
              <div class="plus" @click="plus">+</div>
            </div>
            <div class="btn" :class="{ disable: (!can_join || investment * 2.5 > r7)}" @click="confirm">{{$t('dialog.join.content_3')}}</div>
            <div class="bottom">
              <div class="link" @click="quit">{{$t('dialog.join.content_4')}}</div>
            </div>

        </div>
      </div>
    </Card>
    <Quit ref="quit"/>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { formatWei, join} from '@/utils/Wallet.js'
import { play, isValidCode, quit } from '@/utils/Wallet.js'
import { SET_IS_GUIDE, SET_IS_NO_WALLET } from '@/store/mutation-types.js'
import store from '@/store'
import Card from '@/components/common/Card'
import Quit from '@/pages/Dialog/Quit'
import accounting from 'accounting'
import _ from 'lodash'

export default {
  name: 'Join',
  components: {
    Card,
    Quit
  },
  created() {
  },
  data() {
    return {
      input_amount: 1
    }
  },
  watch: {
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
  
  computed: {
    can_join: function() {
      return parseInt(this.boxExpire) > parseInt(Date.now()/1000)
    },
    ...mapState({
      investment: state => formatWei(state.wallet.investment), // 地址参与
      boxExpire: state => state.wallet.boxExpire, // 宝箱到期
      r7: state => formatWei(state.wallet.r7), // 全部奖励
    })
  },
  methods: {
    onChange: function(e) {
      let value = parseInt(e.target.value)
      if(!isNaN(value)){
        if(value >= 99){
          this.input_amount = 99
        }else if(value < 0){
          this.input_amount = 1
        }else{
          this.input_amount = value
        }
      }
    },
    minus: function() {
      if(this.input_amount - 1 > 0) {
        this.input_amount--
      }
    },
    plus: function() {
      if(this.input_amount < 99) {
        this.input_amount++
      }
    },
    confirm:async function() {
      if(this.investment * 2.5 > this.r7 || !this.can_join){
        return false
      }
      play(this.input_amount)
    },
    quit: function() {
      this.$refs.quit.open()
    }
  }
}
</script>

<style lang='scss' src='@/assets/css/pages/home/card/join.scss' scoped></style> 