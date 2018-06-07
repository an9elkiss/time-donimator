import axios from 'axios'
import Global from './global'
// require('es6-promise').polyfill()
const path = Global.url.apiPersons
const formatUrl = url => {
  const isAbsolutePath = /^http+/.test(url)
  if (isAbsolutePath) {
    return url
  } else {
    return path + url
  }
}

export const http = async function (url, form, method = 'POST') {
  url = formatUrl(url)
  const config = {
    method: method,
    url: url,
    headers: {
      'Content-Type': 'application/json'
    },
    xhrFields: {
      withCredentials: true
    },
    crossDomain: true,
    withCredentials: false
  }
  config.data = {}
  if (form) {
    config.data = form
  }
  try {
    const result = await axios(config)
    if (result.status === 200) {
      return result
    }
  } catch (err) {
    console.log(err)
  }
}
