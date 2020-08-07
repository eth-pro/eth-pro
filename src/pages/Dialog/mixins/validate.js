import _ from 'lodash'
export default {
  data: function () {
    return {
      tip: {}
    }
  },
  computed: {
    is_show_tip: function() {
      return (name) => {
        if (typeof this.tip[name] == 'undefined') {
          return false
        }
        return this.tip[name].length > 0
      }
    },
    has_error: function() {
      let has_error = false
      _.each(this.tip, (content, key) => {
        if (content.length > 0) {
          has_error = true
        }
      })
      return has_error
    }
  },
  methods: {
    showTip: function(name, content) {
      this.$set(this.tip, name, content)
    },
    clearTip: function() {
      this.tip = {}
    }
  }
}