import axios from 'axios'
import router from 'vue-router'//
import store from '@/store'

axios.interceptors.request.use(config => {
  if (config.method === 'post' || config.method === 'put') {
    config.data = {
      ...config.data,
      token: store.state.user.token
    }
  } else if (config.method === 'get' || config.method === 'delete') {
    config.params = {
      ...config.params,
      token: store.state.user.token
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
    if (result.status === 200) {
      return result
    }
  } catch (err) {}
}
