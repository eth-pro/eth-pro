import axios from 'axios'
import _ from 'lodash'

export default class Base {
  static async call(url, params = {}, type = 'get', config = {}) {
    let response = null
    switch (type.toLowerCase()) {
      case 'get':
        response = await this.get(url, params, config)
        break
      case 'post':
        response = await this.post(url, params, config)
        break
    }
    return response
  }

  static async get(url, params, config) {
    params = _.defaults(
      {
        _t: new Date().getTime()
      },
      params
    )
    const response = await axios(
      _.defaults(
        {
          method: 'get',
          url: url,
          params: params
        },
        config
      )
    )

    return response
  }

  static async post(url, params, config) {
    const response = await axios(
      _.defaults(
        {
          method: 'post',
          url: url,
          data: params
        },
        config
      )
    )

    return response
  }
}
