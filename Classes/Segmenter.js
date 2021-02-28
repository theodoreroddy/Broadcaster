const Bash = require('child_process').execSync
const Log = require('../Utilities/Log.js')
const { FFMpegSession } = require('./FFMpegSession.js')
const path = require('path') 
const tag = path.basename(__filename)

function Segmenter(channel) {

  this.channel = channel
  this.session = null

  this.start = async (channel) => {
    return new Promise((resolve, reject, error) => {
      if (error) {
        reject(error)  // calling `reject` will cause the promise to fail with or without the error passed as an argument
        return        // and we don't want to go any further
      }
      this.session = new FFMpegSession(this.channel.queue[this.channel.currentPlaybackIndex])
      Log(tag, channel, 'FFmpeg starting.')
      resolve(data)
    })
  }

  this.flush = async () => {
    Bash(`find ./Webapp/channels/${channel.slug}/ -type f -mmin +100 -delete &`)
  }

}

module.exports = {
  Segmenter: Segmenter
}