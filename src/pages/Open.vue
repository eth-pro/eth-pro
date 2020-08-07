<template>
    <div id="open">
      <div class="head">
        <h2>{{$t('OPEN.TITLE')}}</h2>
        <h3>{{$t('OPEN.SUBTITLE')}}</h3>
      </div>
      <div class="main">
        <div class="content">
          <div class="block">
            <h4>{{$t('OPEN.BLOCK0.TEXT0')}}</h4>
            <p>{{$t('OPEN.BLOCK0.TEXT1')}}</p>
            <p><a href="https://cn.etherscan.com/address/0xb082c4c958a4e28afc5dfe535b8e54480e6ffa52#code" target="_blank">https://cn.etherscan.com/address/0xb082c4c958a4e28afc5dfe535b8e54480e6ffa52#code</a></p>
            <br />
            <p>{{$t('OPEN.BLOCK0.TEXT2')}}</p>
            <img src="@/assets/img/open/EmStaticPool.png" />
          </div>
          <div class="block">
            <h4>{{$t('OPEN.BLOCK1.TEXT0')}}</h4>
            <p>{{$t('OPEN.BLOCK1.TEXT1')}}</p>
            <p><a href="https://cn.etherscan.com/address/0xd77de71d78e1359c814c14201e87ce2979447a18#code" target="_blank">https://cn.etherscan.com/address/0xd77de71d78e1359c814c14201e87ce2979447a18#code</a></p>
            <br />
            <p>{{$t('OPEN.BLOCK1.TEXT2')}}</p>
            <img src="@/assets/img/open/EmQueuePool.png" />
          </div>
          <div class="block">
            <h4>{{$t('OPEN.BLOCK2.TEXT0')}}</h4>
            <p>{{$t('OPEN.BLOCK2.TEXT1')}}</p>
            <p><a href="https://cn.etherscan.com/address/0x18639f44f946983bf3413d9b51322d05c29d269e#code" target="_blank">https://cn.etherscan.com/address/0x18639f44f946983bf3413d9b51322d05c29d269e#code</a></p>
            <br />
            <p>{{$t('OPEN.BLOCK2.TEXT2')}}</p>
            <img src="@/assets/img/open/EmCandyPool.png" />
          </div>
          <div class="block">
            <h4>{{$t('OPEN.BLOCK3.TEXT0')}}</h4>
            <p>{{$t('OPEN.BLOCK3.TEXT1')}}</p>
            <p><a href="https://cn.etherscan.com/address/0xb6f8ef5e381fd19769f8b420e3187e449413e478#code" target="_blank">https://cn.etherscan.com/address/0xb6f8ef5e381fd19769f8b420e3187e449413e478#code</a></p>
            <br />
            <p>{{$t('OPEN.BLOCK3.TEXT2')}}</p>
            <img src="@/assets/img/open/EmJackpotPool.png" />
          </div>
          <div class="block">
            <h4>{{$t('HOME.SOURCE_CODE')}}</h4>
            <p><a href="http://github.com/ETHPRO" target="_blank">http://github.com/etherminers</a></p>
          </div>
        </div>
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

<style lang='scss' src='@/assets/css/pages/open.scss' scoped></style> 