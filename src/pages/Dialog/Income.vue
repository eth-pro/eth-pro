
<template>
  <Dialog id="income" ref="dialog" :closeable="true" @closed="closed">
    <div slot="content" class="content">
      <h3>{{$t('INCOME.TITLE')}}</h3>
      <div class="tips-group">
        <div class="tip">{{$t('INCOME.TIP',{static_profiting: floor(static_profiting)})}}</div>
      </div>
      <div class="btn-group">
        <div class="btn confirm" @click="confirm">
          {{$t('INCOME.RECEIVE')}}
        </div>
      </div>
      <div class="notice" v-show="left_seconds > 0">{{$t('INCOME.COUNTDOWN')}}{{left_seconds | countdown}}</div>
    </div>
  </Dialog>
</template>
<script>
import Dialog from '@/components/common/Dialog'
import {mapState} from 'vuex'
import { receive, formatWei } from '@/utils/Wallet.js';
import {SET_INCOME_DIALOG_SHOW } from '@/store/mutation-types.js'

export default {
  components: {
    Dialog
  },
  data(){
    return {
      resolve: null,
      left_seconds: 0,
      countdown_timer: null,
    }
  },
  mounted(){
    this.countdown_timer = setInterval(() => {
      const now = parseInt(Date.now()/1000)
      const timeout = parseInt(this.time_receive) + parseInt(this.timeout_half_static)
      if(timeout > now){
        this.left_seconds = timeout - now
      }
    }, 1000)
  },
  beforeDestroy(){
    clearInterval(this.left_seconds)
  },

  computed: {
    ...mapState({
      level: state => state.wallet.level,
      static_profiting: state => formatWei(state.wallet.static_profiting),
      address: state => state.wallet.address,
      time_receive: state => state.wallet.time_receive,
      timeout_half_static: state => state.wallet.timeout_half_static,
    })
  },
  methods: {
    floor: function(value, decimal = 6) {
      if (value == 0) {
        return 0
      }
      return _.floor(value, decimal)
    },
    open: function() {
      this.$refs.dialog.open()
      return new Promise((resolve) => {
        this.resolve = resolve
      })
    },
    close: function() {
      this.$refs.dialog.close()
    },
    closed: function() {
      this.dialogHasShown()
      this.resolve()
    },
    confirm: function(){
      receive()
      this.close()
    },
    dialogHasShown: function() {
      this.$store.commit(SET_INCOME_DIALOG_SHOW, {
        address: this.address
      })
    },
  }
}
</script>
<style lang="scss"  src='@/assets/css/pages/dialog/income.scss' scoped></style>