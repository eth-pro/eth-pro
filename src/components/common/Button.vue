<template>
  <div id='button' :class="$i18n.locale">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: ['text']
}
</script>

<style lang='scss' src='@/assets/css/components/button.scss' scoped></style>