const path = require('path')
const fs = require('fs')
const _ = require('lodash')
const translate = require('google-translate-api');


const {getKey, listFiles} = require('./utils')
const {findText} = require('find-text')
const scan_dir = [path.resolve(__dirname + path.sep + '../src/pages'), path.resolve(__dirname + path.sep + '../src/components'), path.resolve(__dirname + path.sep + '../src/App.vue')]
const lang_dir = path.resolve(__dirname + path.sep + '../src/assets/lang')
const to_lang_list = ['zh-TW']

async function main(){
  for(let to_lang of to_lang_list){
    let lang = 'zh-CN'
    let lang_path = lang_dir + path.sep + lang + '.json'
    // read file
    let data = JSON.parse(fs.readFileSync(lang_path, 'utf-8'))
    const keys = getKey(data)
    // query whether keys exist
    for(val of keys) {
      let translate_content = _.get(data, val)
      if(typeof translate_content == 'undefined' || typeof translate_content == "object"){
        continue
      }
      if(_.isEmpty(translate_content)){
        continue
      }
      let {text} = await translate(translate_content, {from:lang.toLowerCase(), to: to_lang.toLowerCase()})
      text = _.replace(text, /\$ m/g, '$m')
      text = _.replace(text, /\$F/g, '$F')
      _.set(data, val, text)
    }
    fs.writeFileSync(path.resolve(__dirname + path.sep + 'lang' +path.sep + to_lang + '.json'), JSON.stringify(data))
  }
}
main()