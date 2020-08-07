<template>
  <div id="help-bottom">
    <div class="help-bottom-div">
      <div class="help-bottom-content">
        <span>{{$t('HELP.BOTTOM_TIP')}}</span>
        <a href="mailto:smart.fund@outlook.com" target="_blank">{{$t('HELP.FEEDBACK')}}</a>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'HelpBottom',
  components: {
    
  }
}
</script>

<style lang='scss' src='@/assets/css/components/helpBottom.scss' scoped></style>