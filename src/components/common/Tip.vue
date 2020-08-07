<template>
  <div :class="{show: is_show}" class="tip">
    <div class="main" :class="{question: is_question}" @click="open">
      {{tips_title}}
      <i class="notice">
        <div class="content-div" ref="content">
          <slot name="content"></slot>
        </div>
      </i>
    </div>
    <div v-show="is_show" @click="is_show = false" class="background"></div>
  </div>
</template>

<script>
const clickOutside = {
  bind: function(el, binding, vNode) {
    el.__vueClickOutside__ = event => {
      if (!el.contains(event.target)) {
        // call method provided in v-click-outside value
        vNode.context[binding.expression](event)
        event.stopPropagation()
      }
    }
    document.body.addEventListener('click', el.__vueClickOutside__)
  },
  unbind: function(el, binding, vNode) {
    // Remove Event Listeners
    document.removeEventListener('click', el.__vueClickOutside__)
    el.__vueClickOutside__ = null
  }
}
export default {
  props: ['is_question', 'tips_title'],
  data() {
    return {
      is_show: false,
    }
  },
  directives: {
    clickOutside
  },
  methods: {
    open: function(e) {
      this.$refs.content.style.left = -e.x + 20 + "px"
      this.is_show = true
    }
  }
}
</script>

<style lang="scss"  scoped>
.tip {
  display: inline-block;
  position: relative;

  i {
    &.notice {
      display: inline-block;
      vertical-align: middle;
      font-style: normal;
      width: 0;
      cursor: pointer;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 10px solid #979ea5;
    }
  }

  .msg {
    display: none;
    position: absolute;
    right: -14px;
    top: 80px;
    z-index: 10;
    width: 500px;
    background-color: #fff;
    padding: 24px 32px;
    box-shadow: 0px 3px 10px #919191;
    border-radius: 12px;
    opacity: 0;
    line-height: 34px;
    font-size: 20px;
    color: #3b3b3b;
    text-indent: 0;
    white-space: normal;

    &::after {
        position: absolute;
        content: "";
        display: block;
        top: -24px;
        right: 18px;
        width: 0; 
        height: 0;
        border-width: 10px;
        border-style: solid;
        border-color: #3b3b3b transparent transparent transparent;
      }

    /deep/ ol {
      padding-left: 20px;
      list-style: decimal;

      ol {
        padding-left: 24px;
        list-style: lower-alpha;
      }
    }

    /deep/ h4 {
      margin-top: 32px;
    }
  }

  .msg:before{
    content: '';
    border-right: 12px solid transparent;
    border-top: 0;
    border-bottom: 12px solid #919191;
    border-left: 12px solid transparent;
    position: absolute;
    right: 25px;
    top: 0;
    margin-left: -12px;
    margin-top: -12px;
  }

  .msg:after{
    content: '';
    border-right: 12px solid transparent;
    border-top: 0;
    border-bottom: 12px solid #fff;
    border-left: 12px solid transparent;
    position: absolute;
    right: 25px;
    top: 0;
    margin-left: -12px;
    margin-top: -12px;
  }

  .background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #000;
    opacity: 0.4;
    z-index: 9;
  }
  
  &.show {
    .msg {
      display: block;
      opacity: 1;
    }
  }
}
</style>
