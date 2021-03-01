const express = require('express')
const bodyParser = require('body-parser')
const Log = require('../Utilities/Log.js')
const tag = 'TelevisionUI'
const { CACHE_DIR, WEB_UI_PORT } = process.env
const port = WEB_UI_PORT
const Bash = require('child_process').execSync
const fs = require('fs')
const ChannelPool = require('../Utilities/ChannelPool.js')

// express app that listens on specified port and handles GET requests for .m3u8 files
// asynchronously caches the ffmpeg .m3u8 files every X seconds

var ui = null

class TelevisionUI {

  constructor(app,port) {
    this.app = express()
    this.port = port
  }

  start(channelPool) {
    
    Bash(`cp -r ${__dirname}/static ${CACHE_DIR}/broadcaster/channels/\n` +
         `cp ${__dirname}/index.html ${CACHE_DIR}/broadcaster/\n` +
         `cp ${__dirname}/static.gif ${CACHE_DIR}/broadcaster/ &`)

    this.app.use(express.static(`${CACHE_DIR}/broadcaster`))

    this.app.get(`/manifest.json`, function(req,res){

        const manifest = {
            
        }
        res.send(JSON.stringify(manifest))

    })

    channelPool.queue.forEach((channel) => {

        this.app.get(`/${channel.slug}.m3u8`, function(req,res){

            if (channel.timeline.started) {

                const offset = Date.now() - channel.timeline.startTime

                try {
                    
                    var stream = fs.readFileSync(`${CACHE_DIR}/broadcaster/channels/${channel.slug}/_.m3u8`)
                    stream = stream.toString().replace(/\#EXT\-X\-PLAYLIST\-TYPE\:EVENT\n/,`#EXT-X-PLAYLIST-TYPE:EVENT\n#EXT-X-START:TIME-OFFSET=${offset/1000}\n`)
                    stream = stream.toString().replace(/\#EXT\-X\-ENDLIST\n/g, '')
                    stream = stream.toString().replace(/\#EXT\-X\-DISCONTINUITY\n/g, '')
                    stream = stream.replace(/\n_/g,`\nchannels/${channel.slug}/_`)
                    res.set({
                        'Content-Type': 'application/x-mpegURL'
                    })
                    res.send(stream)

                } catch(e) {
                    Log(tag, `Couldn't return m3u8:\n` + e, channel)
                    res.statusCode = 500
                    res.send('')
                }

            } else {

                res.statusCode = 500
                res.send('Broadcaster HLS channel not started yet.')

            }

        })

    })

    this.app.listen(port, async () => {
        Log(tag, `Webapp is live at http://tv:${port}`)
    })

  }

}

module.exports = () => {
  return ui ? ui : ui = new TelevisionUI()
}
