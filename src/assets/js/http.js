import axios from 'axios'
import router from 'vue-router'
import Global from '@/components/Global'

axios.interceptors.request.use(config => {
  if (config.method === 'post' || config.method === 'put') {
    config.data = {
      ...config.data,
      token: Global.token
    }
  } else if (config.method === 'get' || config.method === 'delete') {
    config.params = {
      ...config.params,
      token: Global.token
    }
  }
  return config
}, error => {
  return Promise.reject(error)
})

axios.interceptors.response.use(response => {
  switch (response.data.code) {
    case 500:
      router.replace({
        path: '/login'
      })
      break
    default: return response
  }
  return response
}, error => {
  if (error.response) {
    switch (error.response.status) {
      case 500:
        router.replace({
          path: '/login',
          query: {redirect: router.currentRoute.fullPath}
        })
        break
      default: console.log('cannot handle response status %d', error.response.status)
    }
  }
})

export const http = async function (url, form, method = 'POST') {
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
    console.log(result)
    if (result) {
      return result
    }
  } catch (err) {}
}
