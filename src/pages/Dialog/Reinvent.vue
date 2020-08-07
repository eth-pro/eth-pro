
<template>
  <Dialog id="reinvent" ref="dialog" :closeable="true" @closed="closed">
    <div slot="content" class="content">
      <h3>{{$t('REINVENT.TITLE',{max_profit:max_profit})}}</h3>
      <div class="tips-group">
        <div class="tip">{{$t('REINVENT.TIP')}}</div>
      </div>
      <div class="btn-group">
        <div class="btn confirm" @click="confirm">
          {{$t('REINVENT.REPEAT')}}
        </div>
      </div>
    </div>
  </Dialog>
</template>
<script>
import Dialog from '@/components/common/Dialog'
import {mapState} from 'vuex'
import { play, formatWei } from '@/utils/Wallet.js';
import {SET_INCOME_DIALOG_SHOW } from '@/store/mutation-types.js'
import VueScrollTo from 'vue-scrollto'

export default {
  components: {
    Dialog
  },
  data(){
    return {
      resolve: null,
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
    open: function() {
      this.$refs.dialog.open()
      return new Promise((resolve) => {
        this.resolve = resolve
      })
    },
    close: function() {
      this.$refs.dialog.close()
      this.resolve()
    },
    closed: function() {
      this.dialogHasShown()
      this.resolve()
    },
    confirm: function(){
      this.close()
      this.join()
    },
    join: function(){
      VueScrollTo.scrollTo('#join', 300, {
        offset: -80,
      })
    },
    dialogHasShown: function() {
      this.$store.commit(SET_INCOME_DIALOG_SHOW, {
        address: this.address
      })
    },
  }
}
</script>
<style lang="scss"  src='@/assets/css/pages/dialog/reinvent.scss' scoped></style>