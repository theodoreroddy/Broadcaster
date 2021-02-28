const ChannelPool = require('../Utilities/ChannelPool.js')
const Bash = require('child_process').execSync
const Log = require('../Utilities/Log.js')
const { FFMpegSession } = require('./FFMpegSession.js')
const tag = 'Segmenter'
const { CACHE_DIR } = process.env

function Segmenter(channel) {

  Bash(`mkdir ${CACHE_DIR}/broadcaster/channels/${channel.slug} &`)
  Bash(`cp ${__dirname.replace('Classes','')}Webapp/fullscreen.html ${CACHE_DIR}/broadcaster/channels/${channel.slug}/ &`)

  this.channel = channel
  this.session = new FFMpegSession(this.channel)

  this.flush = () => {
    Bash(`find ${CACHE_DIR}/broadcaster/channels/${this.channel.slug}/ -type f -mmin +100 -delete &`)
  }

  return {
    flush: this.flush,
    session: this.session,
    channel: this.channel
  }

}

module.exports = {
  Segmenter: Segmenter
}
