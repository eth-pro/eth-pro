<template>
    <div id="about">
      <div class="banner">
        <img v-if="$i18n.locale == 'en'" src='@/assets/img/about/banner_en.png' />
        <img v-else src='@/assets/img/about/banner_tw.png' />
      </div>
      <div class="gap">
          <img class="pie" v-if="$i18n.locale == 'en'" src="@/assets/img/about/pie_en.png" />
          <img class="pie" v-else src="@/assets/img/about/pie_tw.png" />
      </div>
      <div class="block">
        <h2>{{$t('about.content_1')}}</h2>
        <h2>{{$t('about.content_2')}}</h2>
        <div class="gap">
          <p>{{$t('about.content_3')}}</p>
          <p>{{$t('about.content_4')}}</p>
        </div>
      </div>
      <div class="block">
        <h2>{{$t('about.content_5')}}</h2>
        <div class="gap">
          <p>{{$t('about.content_6')}}</p>
          <p>{{$t('about.content_7')}}</p>
          <p>{{$t('about.content_8')}}</p>
        </div>
      </div>
      <div class="block">
        <h2>{{$t('about.content_9')}}</h2>
        <div class="gap">
          <p>{{$t('about.content_10')}}</p>
        </div>
      </div>

      <div class="bottom">
        &copy;2019-2020 ETH PRO.All Rights Reserved
      </div>
    </div>
</template>
<script>
import _ from 'lodash'
export default {
  name: 'About',
  components: {
  },
  data() {
    return {
    }
  },
  created() {
  },
  mounted() {
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style lang='scss' src='@/assets/css/pages/about.scss' scoped></style> 