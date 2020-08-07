import Vue from 'vue'
import fecha from 'fecha'
import _ from 'lodash'

Vue.filter('levelName', function(value){
  value = parseInt(value)
  switch(value){
    case 1:
      return 'm1'
    case 2:
      return 'm2'
    case 3:
      return 'm3'
    case 4:
      return 'n1'
    case 5:
      return 'n2'
    case 6:
      return 'n3'
    case 7:
      return 'n4'
    default:
      return ''
  }
})

Vue.filter('toUpperCase', function(value){
  return value.toUpperCase()
})

Vue.filter('toLowerCase', function(value){
  return value.toLowerCase()
})

Vue.filter('date', function(value, format= "YYYY-MM-DD"){
  return fecha.format(value, format)
})

Vue.filter('countdown', function(left_seconds){
  let hours, minutes, seconds
  hours = parseInt(left_seconds / 3600)
  left_seconds = left_seconds % 3600
  minutes = parseInt(left_seconds / 60)
  seconds = left_seconds % 60
  return _.padStart(hours , 2, '0') + ':' + _.padStart(minutes, 2, '0') + ':' + _.padStart(seconds, 2, '0')
})

Vue.filter('short_address', function(value) {
  if (value == null) {
    return ''
  }
  return value.slice(0,6) + '...' + value.slice(value.length - 4, value.length)
})

Vue.filter('floor', function(value, decimal = 2) {
  if (value == 0) {
    return 0
  }
  return _.floor(value, decimal)
})

Vue.filter('todays', function(value) {
  let days = value/86400
  return days > 1 ? parseInt(days) : _.floor(days, 1)
})