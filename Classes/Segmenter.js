const ChannelPool = require('../Utilities/ChannelPool.js')
const Bash = require('child_process').execSync
const Log = require('../Utilities/Log.js')
const { FFMpegSession } = require('./FFMpegSession.js')
const tag = __filename.split('/').pop()


function Segmenter(channel) {

  this.start = (channel, session) => {
      this.channel = channel
      this.session = new FFMpegSession(this.channel.queue[this.channel.currentPlaybackIndex])
      
      Log(tag, this.channel, 'FFmpeg starting.')
  }

  this.flush = () => {
    Bash(`find ./Webapp/channels/${this.channel.slug}/ -type f -mmin +100 -delete &`)
  }

}

module.exports = {
  Segmenter: Segmenter
}
