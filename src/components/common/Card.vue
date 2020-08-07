<template>
  <div class="card">
    <div class="card-title">
      <span class="title-main"><i class="icon" :class="icon"></i>{{title}}</span> 
      <span class="spilt"></span>
      <span class="title-sub">{{sub_title}}</span>

      <span class="tips" @click="onTipsClick" v-if="false">
        <Tip :tips_title="tips_title">
          <div slot="content">
            <div class="msg">
              <div class="content" v-html="msg"></div>
            </div>
          </div>
        </Tip>
      </span>
    </div>
    <div class="card-content">
      <div class="content">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>
<script>
import Tip from '@/components/common/Tip'
export default {
  props: ['title', 'sub_title', 'icon', 'tips_title', 'msg'],
  components: {
    Tip
  },
  data: function() {
    return {
    }
  },
  methods: {
    onTipsClick: function() {
      this.$emit('onTipsClick')
    }
  }
}
</script>
<style lang='scss' src='@/assets/css/components/card.scss' scoped></style>