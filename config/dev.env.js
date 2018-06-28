'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_API: '"http://10.88.91.15:9001"',
  BASE_API_USER: '"http://10.88.91.15:9005"',
  BASE_API_MANAGER: '"http://10.88.91.15:9006"'
})
