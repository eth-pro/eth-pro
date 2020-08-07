<template>
  <div id='top' ref="top" :class="{transparent:transparent}">
    <div class="logo">
      <img src="@/assets/img/logo.png" />
      <span>ETH PRO</span>
    </div>
    <nav class="nav">
      <dropdown class="purchase-dropdown" :options="cropty_list" :selected="cropty_list[$i18n.locale]" v-on:updateOption="updateOption" :placeholder="''">

      </dropdown>
    </nav>
  </div>
</template>

<script>
const TRANSPARENT_PAGE = ['Home', 'Open']
import scrollDir from 'scrolldir'
import Dropdown from '@/components/common/Dropdown'
import Cookies from 'js-cookie'

export default {
  name: 'Top',
  created() {
  },
  components: {
    Dropdown
  },
  mounted() {
    scrollDir({
      el: this.$refs.top,
      dir: 'up',
      back_string: ''
    })
    this.checkNav()
    window.addEventListener('scroll', e => {
      this.checkNav()
    })
  },
  filters: {
  },
  watch: {
    $route: function() {
      this.checkNav()
    },
  },
  computed: {
  },
  data() {
    return {
      transparent: false,
      cropty_list: {'zh-TW':"/zh-tw.jpg",'en': "/en.jpg"}
    }
  },
  methods: {
    updateOption: function(name, code) {
      Cookies.set('lang', code, { expires: 31 })
      this.$i18n.locale = code
    },
    navSwitch: function() {
    },
    checkNav: function() {
	  let top = document.documentElement.scrollTop || document.body.scrollTop || window.pageYOffset
      if (this.$route.name == 'Operation') {
        if (top <= 20) {
          this.$refs.top.attributes['data-scrolldir'].value = 'up'
        } else {
          this.$refs.top.attributes['data-scrolldir'].value = 'down'
        }
      }

      if (typeof this.$route.matched[0] != 'undefined' &&
        TRANSPARENT_PAGE.indexOf(this.$route.matched[0].name) > -1 &&
        document.documentElement.scrollTop <= 50
      ) {
        this.transparent = true
      } else {
        this.transparent = false
      }
    },
  }
}
</script>

<style lang='scss' src='@/assets/css/components/top.scss' scoped></style>