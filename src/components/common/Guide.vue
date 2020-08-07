<template>
  <van-popup class="guide-popup" :value="is_guide" @click-overlay="close" transition="van-fade" position="top">
    <div class='guide' :class="$i18n.locale" @click="close">
      <div class="text">
        <p>{{$t('GUIDE.TEXT0')}}<img src="@/assets/img/arrow.png"></p>
        <p>{{$t('GUIDE.TEXT1')}}</p>
      </div>
    </div>
  </van-popup>
</template>

<script>
import { mapState } from 'vuex'
import { Popup } from 'vant';
import {
  SET_IS_GUIDE
} from '@/store/mutation-types.js'
export default {
  components: {
    'van-popup':Popup,
  },
  name: '',
  data() {
    return {

    }
  },
  created() {

  },
  methods: {
    close: function() {
      this.$store.commit(SET_IS_GUIDE, false)
    }
  },
  computed: {
    ...mapState({
      is_guide: state => state.app.is_guide
    })
  },
}
</script>

<style lang='scss' src='@/assets/css/components/guide.scss' scoped></style>