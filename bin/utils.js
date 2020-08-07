const fs = require('fs')
const _ = require('lodash')
const path = require('path')

function getKey(obj) {
  let keys = []
  _.each(obj, (value, key) => {
    if(_.isObject(value)){
      _.each(getKey(value), (val) => {
        keys.push(key + '.' + val)
      })
    }else{
      keys.push(key)
    }
  })
  return keys
}

function listFiles(dir) {
  let files = []
  let stat = fs.statSync(dir)
  if(stat.isDirectory()){
    // If it's a folder, traverse the folder and continue searching
    _.each(fs.readdirSync(dir), (file) => {
      files = _.concat(files, listFiles(dir + path.sep + file))
    })
  }else{
    files.push(dir)
  }
  return files
}


module.exports = {
  getKey,
  listFiles
}