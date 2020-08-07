export default {
  methods: {
    aotuFocus: function(selector = 'input') {
      this.$nextTick(() => {
        if (typeof this.$el.getElementsByTagName != 'function') return false

        const input = this.$el.getElementsByTagName(selector)[0]
        if (typeof input != 'undefined') {
          input.focus()
        }
      })
    }
  }
}