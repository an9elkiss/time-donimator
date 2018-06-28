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
      var param = function (obj) {
        var query = ''
        var name, value, fullSubName, subName, subValue, innerObj, i

        for (name in obj) {
          value = obj[name]

          if (value instanceof Array) {
            for (i = 0; i < value.length; ++i) {
              subValue = value[i]
              fullSubName = name + '[' + i + ']'
              innerObj = {}
              innerObj[fullSubName] = subValue
              query += param(innerObj) + '&'
            }
          } else if (value instanceof Object) {
            for (subName in value) {
              subValue = value[subName]
              fullSubName = name + '[' + subName + ']'
              innerObj = {}
              innerObj[fullSubName] = subValue
              query += param(innerObj) + '&'
            }
          } else if (value !== undefined && value !== null) {
            query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&'
          }
        }
        return query.length ? query.substr(0, query.length - 1) : query
      }
      return param(data)
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
