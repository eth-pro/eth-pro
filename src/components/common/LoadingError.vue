<template>
  <div id='loading' :class="{loading_error: is_loading_error}">

  </div>
</template>

<script>
import { Toast } from 'vant'
import { mapState } from 'vuex'
export default {
  data: function(){
    return {
      toast: null
    }
  },
  watch: {
    is_loading_error: function(val){
      if(val){
        var message = this.$t('TOAST.CONENCT_ERROR')
        this.toast = Toast.fail({
          duration: 4000,
          forbidClick: true,
          className: 'loading_error',
          mask: true,
          message: message
        })
      }else{
        if(this.toast != null){
          this.toast.clear()
        }
      }
    }
  },
  computed: {
    ...mapState({
      is_loading_error: state => {
        return state.wallet.is_loading_error
      }
    })
  },
}
</script>

<style lang='scss' src='@/assets/css/components/loading.scss' scoped></style>
