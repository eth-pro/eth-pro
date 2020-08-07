
<template>
  <Dialog id="redeem" ref="dialog" :title="$t('dialog.quit.content_0')" :closeable="true" @closed="closed">
    <div slot="content" class="content">
      <div class="data">
        <div>{{$t('dialog.quit.content_1')}} {{currTotalInvestment | floor}}</div>
        <div v-if="quitable == 0">{{$t('dialog.quit.content_2')}} {{0}}</div>
        <div v-else>{{$t('dialog.quit.content_2')}} {{parseFloat(investment) * 0.8 -  parseFloat(ethDone) * 2 | floor}}</div>
      </div>
      <div class="btn-group">
        <div class="btn" @click="close">{{$t('dialog.quit.content_4')}}</div>
        <div class="btn confirm" v-if="!disable" @click="confirm">{{$t('dialog.redeem.content_2')}}</div>
      </div>
      <div class="tip" v-if="quitable == 0">{{$t('dialog.quit.content_5')}}</div>
      <div class="tip" v-else-if="quitable == 0">{{$t('dialog.quit.content_6')}}</div>
      <div class="tip" v-else-if="disable">{{$t('dialog.quit.content_7')}}</div>
      <div class="tip" v-else>{{$t('dialog.quit.content_3')}}</div>
    </div>
  </Dialog>
</template>
<script>
import Dialog from "@/components/common/Dialog";
import { mapState } from "vuex";
import { quit, formatWei, redeem } from "@/utils/Wallet.js";
import { SET_INCOME_DIALOG_SHOW } from "@/store/mutation-types.js";
import store from '@/store'
export default {
  components: {
    Dialog
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
    },
  },
  data() {
    return {
      amount: ''
    };
  },
  mounted() {
    
  },

  computed: {
    disable: function(){
      if(this.quitable != 1){
        return true
      }
      return parseFloat(this.investment) * 0.8 -  parseFloat(this.ethDone) * 2 < 0.01
    },
    ...mapState({
      currTotalInvestment: state => formatWei(state.wallet.currTotalInvestment),
      investment: state => formatWei(state.wallet.investment),
      totalInvestment: state => formatWei(state.wallet.totalInvestment),
      quitable: state => state.wallet.quitable,
      ethDone: state => formatWei(state.wallet.ethDone),
    })
  },
  methods: {
    open: function() {
      this.amount = ''
      this.$refs.dialog.open();
      return new Promise(resolve => {
        this.resolve = resolve;
      });
    },
    close: function() {
      this.$refs.dialog.close();
    },
    closed: function() {
      this.resolve();
    },
    confirm: function() {
      if(this.disable){
        return false
      }
      quit();
      this.close();
    }
  }
};
</script>
<style lang="scss" scoped>
#redeem {
  .content {
    width: 80%;
    margin: 80px auto 0 auto;
    font-size: 24px;
    padding-bottom: 41px;
    h3 {
      font-size: 36px;
      color: #3b3b3b;
    }
    .data {
      display: flex;
      justify-content: space-around;
      span {
        color: #1b7bff;
      }
    }
    .tip {
      margin-top: 30px;
      color: #ff0000;
    }

    .form {
      .input-group {
        position: relative;
        font-size: 24px;
        height: 64px;
        line-height: 64px;
        border-bottom: 1Px solid #eaeaea;
        input {
          width: 100%;
          height: 64px;
          line-height: 64px;
          background: none;
          border: none;
          text-align: left;
          text-indent: 24px;
        }

        .symbol {
          position: absolute;
          color: #eaeaea;
          right: 0;
          top: 0;
        }
      }
      
    }

    .btn-group {
      margin-top: 58px;
      display: flex;
      justify-content: space-around;
      .btn {
        width: 100%;
        height: 76px;
        line-height: 76px;
        font-size: 30px;
        border-radius: 30px;
        border: solid 1px #28a5ff;
        &.confirm {
          background-color: #1b7bff;
          box-shadow: 4px 6px 13px 0px rgba(40, 165, 255, 0.35);
        }
        &.disable {
          background-color: #565656;
          border: solid 1px #000;
          box-shadow: 4px 6px 13px 0px rgba(0, 0, 0, 0.35);
        }

        &:first-child {
          margin-right: 20px;
          border: solid 1px #565656;
        }
      }
    }

    .notice {
      margin-top: 24px;
      text-align: center;
      font-size: 20px;
      color: #979ea5;
    }
  }
}
</style>