import axios from 'axios'

export const http = async function (url, form, method = 'POST') {
  const config = {
    method: method,
    url: url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    xhrFields: {
      withCredentials: true
    },
    transformRequest: [function (data) {
      let ret = ''
      for (let it in data) {
        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
      }
      return ret
    }],
    crossDomain: true,
    withCredentials: false
  }
  config.data = {}
  if (form) {
    config.data = form
  }
  try {
    const result = await axios(config)
    if (result) {
      return result
    }
  } catch (err) {}
}
