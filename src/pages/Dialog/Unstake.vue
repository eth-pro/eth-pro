
<template>
  <Dialog id="redeem" ref="dialog" :title="$t('dialog.unstake.content_0')" :closeable="true" @closed="closed">
    <div slot="content" class="content">
      <div class="form">
        <div class="input-group">
          <input v-model="amount" :placeholder="$t('dialog.unstake.content_1')" />
          <div class="symbol">EPRO</div>
        </div>
      </div>
      <div class="btn-group">
        <div class="btn confirm" @click="confirm">{{$t('dialog.unstake.content_2')}}</div>
      </div>
    </div>
  </Dialog>
</template>
<script>
import Dialog from "@/components/common/Dialog";
import { mapState } from "vuex";
import { receive, formatWei, unstake } from "@/utils/Wallet.js";
import { SET_INCOME_DIALOG_SHOW } from "@/store/mutation-types.js";

export default {
  components: {
    Dialog
  },
  data() {
    return {
      amount: ''
    };
  },
  mounted() {
    
  },

  computed: {

  },
  methods: {
    floor: function(value, decimal = 6) {
      if (value == 0) {
        return 0;
      }
      return _.floor(value, decimal);
    },
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
      if(parseFloat(this.amount) != this.amount){
        this.$toast(this.$t('dialog.unstake.content_3'))
        return false
      }
      if(this.amount <= 0){
        this.$toast(this.$t('dialog.unstake.content_4'))
        return false
      }
      unstake(this.amount);
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
    padding-bottom: 41px;
    h3 {
      font-size: 36px;
      color: #3b3b3b;
    }
    .tips-group {
      margin-top: 30px;
      text-align: left;
      .tip {
        font-size: 22px;
        line-height: 44px;
        color: #3b3b3b;
        span {
          color: #ff0000;
        }
      }
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