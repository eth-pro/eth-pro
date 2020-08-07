<template>
  <div :class="{show: is_show}" class="tipmark">
    
    <i @click="open" :class="{question: is_question}" class="notice">
      <div class="content-div" ref="content">
        <slot name="content"></slot>
      </div>
    </i>
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
  props: ['is_question'],
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
.tipmark {
  display: inline-block;

  i {
    &.notice {
      position: relative;
      display: inline-block;
      vertical-align: middle;
      font-style: normal;
      height: 14Px; 
      width: 14Px; 
      margin-left: 6px;
      cursor: pointer;
      background: url(../../assets/img/home/notice.png) no-repeat center;
      background-size: contain;

      &.question {
        background: url(../../assets/img/home/notice2.png) no-repeat center;
        background-size: contain;
      }

      .content-div {
        position: relative;
      }
    }
  }

  .msg {
    display: none;
    position: absolute;
    left: 10px;
    bottom: 8px;
    z-index: 10;
    width: 540px;
    background-color: #fff;
    padding: 4px 4px;
    box-shadow: 0px 3px 10px #919191;
    opacity: 0;
    text-indent: 0;
  }

  .background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
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
