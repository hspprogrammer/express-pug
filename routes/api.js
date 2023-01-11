const express = require('express');




const routerConfig = [
  { // 登陆
      address: '/api/holleworld',
      controller: 'api.holleworld',
      filters: [],
      method: ['get'],
      rules: {}
  },
]

module.exports = routerConfig;
