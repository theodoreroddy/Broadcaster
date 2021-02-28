const express = require('express')
const Log = require('./Utilities/Log.js')

// express app that listens on specified port and handles GET requests for .m3u8 files
// asynchronously caches the ffmpeg .m3u8 files every X seconds
