<template>
  <van-popup v-model="show" class="dialog" :closeable="closeable" :close-on-click-overlay="closeable" @closed="closed">
    <div class="title">{{title}}</div>
    <slot name="content">
    </slot>
  </van-popup>
</template>
<script>
import { Popup } from 'vant';
export default {
  components: {
    'van-popup':Popup,
  },
  props: {
    closeable: {
      type: Boolean,
      default: false,
    },
    title : {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      show: false,
    }
  },
  methods: {
    open: function() {
      this.show = true
    },
    close: function() {
      this.show = false
      this.closed()
    },
    closed: function() {
      this.$emit('closed')
    }
  }
}
</script>

<style lang='scss' src='@/assets/css/components/dialog.scss' scoped></style>  