<template>
  <div id="history" ref="history_root" v-if="all.length > 0">
    <div slot="content" class="content">
      <van-list class="list" finished-text>
        <table>
          <tr class="item header">
            <th class="amount">{{$t('epro.history.content_0')}}</th>
            <th class="amount">{{$t('epro.history.content_1')}}</th>
            <th class="address">{{$t('epro.history.content_2')}}</th>
          </tr>
          <tr class="item" v-for="(item, index) in all" :key="index" @click="gotoDetail(item.hash)">
            <td class="amount">{{$t('ACTION.' + item.method.toLowerCase())}}</td>
            <td class="amount">{{$t('epro.history.content_3')}}</td>
            <td class="address">{{item.timestamp | date}}</td>
          </tr>
        </table>
      </van-list>
    </div>
  </div>
</template>
<script>
import { Loading } from "vant";
import { mapState } from "vuex";
import { formatWei } from "@/utils/Wallet.js";
import { play } from "@/utils/Wallet.js";
import Dialog from "@/components/common/Dialog";
import fecha from "fecha";
import { getRecommendPerformance } from "@/utils/Invite.js";

export default {
  components: {
    Dialog,
    Loading
  },
  filters: {
    format: function(value, cropty) {
      if (isNaN(parseInt(value))) {
        return value;
      }
      if (cropty == CROPTY_MSI) {
        return accounting.accounting.formatNumber(value, 0);
      }
      if (value == 0) return 0;
      return accounting.accounting.formatNumber(
        _.floor(Wallet.getInstance().formatWei(value), 2),
        2
      );
    },
    fee_format: function(value) {
      if (value == 0) return "-";
      return accounting.accounting.formatNumber(
        _.floor(Wallet.getInstance().formatWei(value), 6),
        6
      );
    },
    date: function(timestamp) {
      return fecha.format(timestamp * 1000, "YYYY/MM/DD HH:mm:ss");
    },
    full_date: function(timestamp) {
      return fecha.format(timestamp * 1000, "YYYY/MM/DD HH:mm:ss");
    },
    format_wei: function(amount) {
      return formatWei(amount);
    },
    time_ago: function(timestamp) {
      TimeAgo.locale(en);
      const timeAgo = new TimeAgo("en-US");
      return timeAgo.format(timestamp * 1000);
    }
  },
  watch: {
    history_list: function() {
      this.is_loading = false;
    }
  },
  computed: {
    all: {
      cache: false,
      get: function() {
        return _.concat(this.pending_history_list, this.history_list);
      }
    },
    ...mapState({
      pending_history_list: state => state.wallet.pending_history_list,
      history_list: state => state.wallet.history_list
    })
  },
  data: function() {
    return {
      processing_page: 1,
      finish_page: 1,
      all_page: 1,
      per_page: 999999,
      is_loading: true
    };
  },
  beforeDestroy: function() {},
  mounted: function() {},
  methods: {
    open: function() {
      this.$refs.dialog.open();
    },
    close: function() {
      this.$refs.dialog.close();
    },
    closed: function() {},
    getTxUrl: function(tx) {
      if (this.$i18n.locale == "zh-TW") {
        return (
          (BUILD_TYPE == "PROD"
            ? "https://cn.etherscan.com/tx/"
            : "https://ropsten.etherscan.io/tx/") + tx
        );
      } else {
        return (
          (BUILD_TYPE == "PROD"
            ? "https://etherscan.io/tx/"
            : "https://ropsten.etherscan.io/tx/") + tx
        );
      }
    },
    gotoDetail: function(tx) {
      window.open(this.getTxUrl(tx))
    },
  }
};
</script>
<style lang="scss"  src='@/assets/css/pages/epro/history.scss' scoped></style>

