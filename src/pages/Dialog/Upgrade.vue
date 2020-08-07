
<template>
  <Dialog id="upgrade" ref="dialog" :closeable="true" @closed="closed">
    <div slot="content" class="content">
      <h3>{{$t('UPGRADE.TITLE')}}</h3>
      <div class="tips-group">
        <div class="tip">{{$t('UPGRADE.TIP0_' + level,{count_node:count_node, node_type:$options.filters.toUpperCase($options.filters.levelName(this.level + 1))})}}</div>
        <div class="tip">{{$t('UPGRADE.TIP2')}}<time v-if="left_seconds > 0">{{left_seconds | countdown}}</time><time v-else>--:--:--</time></div>
      </div>
      <div class="btn-group">
        <div class="btn cancel" @click="cancel">
          {{$t('UPGRADE.QUIT')}}
        </div>
        <div class="btn confirm" @click="confirm">
          {{$t('UPGRADE.UPGRADE')}}
        </div>
      </div>
    </div>
  </Dialog>
</template>
<script>
import Dialog from '@/components/common/Dialog'
import {mapState} from 'vuex'
import { play, formatWei } from '@/utils/Wallet.js';
import {SET_RUSH_DIALOG_SHOW } from '@/store/mutation-types.js'

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
  computed: {
    ...mapState({
      level: state => state.wallet.level,
      upgrade_investment_gap: state => formatWei(state.wallet.upgrade_investment_gap),
      count_node: state => state.wallet.count_node[parseInt(state.wallet.level) - 3],
      timeout_buy_node: state => state.wallet.timeout_buy_node,
      address: state => state.wallet.address,
    })
  },
  mounted(){
    this.countdown_timer = setInterval(() => {
      const now = parseInt(Date.now()/1000)
      if(this.timeout_buy_node > now){
        this.left_seconds = this.timeout_buy_node - now
      }
    }, 1000)
  },
  beforeDestroy(){
    clearInterval(this.left_seconds)
  },
  methods: {
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
      this.resolve()
    },
    cancel: function(){
      this.dialogHasShown()
      this.close()
    },
    confirm: function(){
      play(this.upgrade_investment_gap)
      this.dialogHasShown()
      this.close()
    },
    dialogHasShown: function() {
      this.$store.commit(SET_RUSH_DIALOG_SHOW, {
        address: this.address,
        index: this.level
      })
    }
  }
}
</script>
<style lang="scss"  src='@/assets/css/pages/dialog/upgrade.scss' scoped></style>