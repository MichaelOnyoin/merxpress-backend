#! /usr/bin/env node
'use strict'

// Pass configuration to application
//const config = require('./config')
//require('./index.js')
require('./index.js')({
  port: 8000,
  host: 'localhost'
})