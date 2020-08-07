<template>
  <div id='notice'>
    <v-snackbar :timeout="3000" v-model="show_error" color="error" right top>
      {{ notice }}
      <v-btn dark flat @click.native="show_error = false">Close</v-btn>
    </v-snackbar>
    <v-snackbar :timeout="3000" v-model="show_success" color="success" right top>
      {{ notice }}
      <v-btn dark flat @click.native="show_success = false">Close</v-btn>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  name: 'Detection',
  data() {
    return {
      notice: '',
      show_success: false,
      show_error: false
    }
  },
  created() {

  },
  methods: {
    error: function(content) {
      this.show_error = true
      this.notice = content
    },
    success: function(content) {
      this.show_success = true
      this.notice = content
    }
  }
}
</script>