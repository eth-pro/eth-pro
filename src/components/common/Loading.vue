<template>
  <div id='loading' :class="{loading:is_loading}">

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
    is_loading: function(val){
      if(val){
        var message = this.$t('LOADING')
        this.toast = Toast.loading({
          duration: 0,
          forbidClick: true,
          className: 'loading',
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
      is_loading: state => {
        return state.wallet.is_loading
      }
    })
  },
}
</script>

<style lang='scss' src='@/assets/css/components/loading.scss' scoped></style>
