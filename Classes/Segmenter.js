const ChannelPool = require('../Utilities/ChannelPool.js')
const Bash = require('child_process').execSync
const Log = require('../Utilities/Log.js')
const { FFMpegSession } = require('./FFMpegSession.js')
const FFProbe = require('../Utilities/FFProbe.js')
const tag = 'Segmenter'
const { CACHE_DIR } = process.env

function Segmenter(channel) {

  Bash(`mkdir ${CACHE_DIR}/broadcaster/channels/${channel.slug} &`)
  Bash(`cp ${__dirname.replace('Classes','')}Webapp/fullscreen.html ${CACHE_DIR}/broadcaster/channels/${channel.slug}/index.html &`)

  this.channel = channel
  this.advance = _ => {
    if (this.channel.currentPlaylistIndex == this.channel.queue.length) {
      Log(tag, `End of playlist reached. Starting over.`, channel)
      this.channel.currentPlaylistIndex = 0
      this.advance()
    } else {
      this.session = new FFMpegSession(this.channel)
      const duration = FFProbe.getDurationInMilliseconds(this.channel.queue[this.channel.currentPlaylistIndex])
      Log(tag, `Advanced to the next track and scheduled to advance in ${duration/1000} seconds`, channel)
      setTimeout(this.advance, duration)
    }
  }
  this.advance()

  this.flush = () => {
    Bash(`find ${CACHE_DIR}/broadcaster/channels/${this.channel.slug}/ -type f -mmin +10 -delete &`)
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
