const path = require('path')
const fs = require('fs')
const _ = require('lodash')
const {getKey, listFiles} = require('./utils')
const {findText} = require('find-text')
const scan_dir = [path.resolve(__dirname + path.sep + '../src/pages'), path.resolve(__dirname + path.sep + '../src/components'), path.resolve(__dirname + path.sep + '../src/App.vue')]
const lang_dir = path.resolve(__dirname + path.sep + '../src/assets/lang')
const lang = 'zh-CN'
const lang_path = lang_dir + path.sep + lang + '.json'


async function main(){
  // read file
  let data = require(lang_path)

  const keys = getKey(data)

  let search_files = []
  _.each(scan_dir, (dir) => {
    search_files = _.concat(search_files, listFiles(dir))
  })

  // query whether keys exist
  for(val of keys) {
    let has_find = false
    for(let i = 0; i < search_files.length; i++){
      const rs =await findText(val, search_files[i])
      if(_.isEmpty(rs)){
        continue
      }
      has_find = true
    }
    if(!has_find) {
      _.unset(data, val)
    }
  }
  fs.writeFileSync(path.resolve(__dirname + path.sep + 'lang' +path.sep + lang + '.json'), JSON.stringify(data))
}
main()