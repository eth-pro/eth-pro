<template>
  <div id='title'>
    <div class="content">{{title}}</div>
    <div class="extra">
      <slot name="extra"></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: ['title']
}
</script>

<style lang='scss' src='@/assets/css/components/title.scss' scoped></style>