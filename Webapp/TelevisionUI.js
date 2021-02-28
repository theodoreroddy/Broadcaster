const express = require('express')
const bodyParser = require('body-parser')
const Log = require('../Utilities/Log.js')
const tag = 'TelevisionUI'
const { CACHE_DIR, WEB_UI_PORT } = process.env
const port = WEB_UI_PORT
const Bash = require('child_process').execSync

// express app that listens on specified port and handles GET requests for .m3u8 files
// asynchronously caches the ffmpeg .m3u8 files every X seconds

var ui = null

class TelevisionUI {

  constructor(app,port) {
    this.app = express()
    this.port = port
  }

  start(segmenter) {
    Log(tag, 'Starting static file server...')
    Bash(`cp -r ${__dirname}/static ${CACHE_DIR}/broadcast/channels/\n` +
         `cp ${__dirname}/index.html ${CACHE_DIR}/broadcast/\n` +
         `cp ${__dirname}/static.gif ${CACHE_DIR}/broadcast/ &`)

    this.app.use(express.static(`${CACHE_DIR}/broadcast/`))
    this.app.listen(port, async () => {
        Log(tag, `Webapp is live at http://tv:${port}`)
    })
  }

}

module.exports = () => {
  return ui ? ui : ui = new TelevisionUI()
}
