const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const execSync = require('child_process').execSync
const exec = require('child_process').exec
const ffmpeg = require('fluent-ffmpeg')

const {
  Worker, isMainThread, parentPort, workerData
} = require('worker_threads')

const clipLength = 10
const log = async (message) => {
  console.log(`${new Date().toUTCString()} - ${message}`)
}

// Get Config
log('Reading config...')
var config = fs.readFileSync('./config.json')
var channels = []
try {
  config = JSON.parse(config)
  config.forEach((chan) => {
    var channel = chan
    channel.queue = []
    channel.currentPlaybackItem = -1
    channels.push(channel)
  })
} catch(e) {
  log('Error reading config.json: ' + e)
}
log(`Found ${channels.length} in the config.`)

// Cleanup previous session
const cleanup = () => {
  log('Cleaning up previous session...')
  execSync('mv channels/static . &')
  execSync('rm -r channels/* > /dev/null &')
  execSync('mv static channels/ &')
}
cleanup()
process.on('exit', function() {
  cleanup()
})

const formats = [
  'mov','mp4','mkv','avi','ts','m2ts','webm','divx','mpg'
]
const supportedFormat = (filename) => {
    var supported = false
    const checkFormat = filename.split('.').pop()
    formats.forEach((availableCodec) => {
      if (checkFormat == availableCodec) {
        supported = true
      }
    })
    return supported
}

const generateQueues = () => {
  channels.forEach((channel) => {
    log(`${channel.slug.toUpperCase()}: Building the queue...`)
    var q = []
    channel.paths.forEach((path) => {
      const cmd = `find "${path}"`
      const output = execSync(cmd)
      output.toString().split('\n').forEach((file) => {
        const array = file.split('.')
        const last = array.pop()
        if (array.length > 0 && last.length >= 3 && last.length <= 4) {
          if (supportedFormat(last)) {
            const clip = {
              file: file
            }
            q.push(clip)
          }
        }
      })
    })
    if (channel.type == 'shuffle') q.sort(() => Math.random() - 0.5)
    log(`${channel.slug.toUpperCase()}: Queue initialized with ${q.length} files.`)
    channel.queue = q
  })
}

// Generate the Queues
try {
  generateQueues()
  log('Done generating queues. Ready to start broadcast.')
} catch(e) {
  log('Error reading queue.json: ' + e)
}

const getVideoLengthInSeconds = (filePath) => {
    const cmd = `ffprobe "${filePath}"  2>&1 | grep -E '^ +Duration: ' | cut -d':' -f2- | cut -d, -f1`
    const duration = execSync(cmd)
    const convert = duration.toString().split(':')
    const hours = convert[0]
    const minutes = convert[1]
    const seconds = convert[2]
    const total = parseFloat(seconds) + (parseFloat(minutes) * 60) + (parseFloat(hours) * 60*60)
    log(`INFO: Video ${filePath} is ${total} seconds long.`)
    return total
}

const startBroadcast = () => {
  log('Beginning the broadcast.')
  channels.forEach((channel) => {
    advancePlayback(channel)
  })
}

const advancePlayback = async (channel) => {
  if (channel.currentPlaybackItem != channel.queue.length) {
    channel.currentPlaybackItem++
    log(`${channel.slug.toUpperCase()}: Advancing to ${channel.queue[channel.currentPlaybackItem].file}`)
    const videoLength = getVideoLengthInSeconds(channel.queue[channel.currentPlaybackItem].file)
    startFfmpeg(channel)
    setTimeout(() => {
      advancePlayback(channel)
    }, (videoLength-clipLength)*1000)
  } else {
    log(`${channel.slug.toUpperCase()}: Reached the end of the queue. Starting over.`)
    channel.currentPlaybackItem = -1
    advancePlayback(channel)
  }
}

const startFfmpeg = async (channel) => {
  if (channel.currentPlaybackItem == 0) execSync(`mkdir channels/${channel.slug} && cp assets/fullscreen.html channels/${channel.slug}/index.html && cp favicon.ico channels/${channel.slug}/favicon.ico`)
  const start = Date.now()
  ffmpeg(channel.queue[channel.currentPlaybackItem].file).addOptions([
      '-c:v h264_nvenc',
      '-crf 21',
      '-vf yadif',
      '-g 24',
      '-sc_threshold 0',
      '-c:a aac',
      '-b:a 128k',
      '-ac 2',
      '-f hls',
      '-hls_time '+clipLength,
      '-hls_flags append_list',
      '-hls_start_number_source datetime',
      '-hls_playlist_type event',
    ])
    .output(`${__dirname}/channels/${channel.slug}/_.m3u8`)
    .on('start', function() {
        if (channel.currentPlaybackItem == 0) channel.startTime = Date.now()
        log(`${channel.slug.toUpperCase()}: FFMpeg started encoding ${channel.queue[channel.currentPlaybackItem].file}.`)
        exec('find ./channels/ -type f -mmin +100 -delete &')
    })
    .on('end', () => {
        log(`${channel.slug.toUpperCase()}: FFMpeg finished encoding ${channel.queue[channel.currentPlaybackItem].file} in ${(Date.now() - start)/1000} seconds.`)
    })
    .on('error', function (err, stdout, stderr) {
      log(`${channel.slug.toUpperCase()}: FFMpeg produced an error, so we're skipping to ${channel.queue[channel.currentPlaybackItem].file}.`)
      advancePlayback(channel)
    })
    .run()

}

log('Starting ExpressJS...')
const app = express()
const port = 12121
startBroadcast()

log('Starting static file server...')
var staticPath = path.join(__dirname, './')
app.use(express.static(staticPath))

channels.forEach((channel) => {

  app.get(`/${channel.slug}.m3u8`, function(req,res){
      const offset = Date.now() - channel.startTime
      try {
        var stream = fs.readFileSync(`./channels/${channel.slug}/_.m3u8`)
        stream = stream.toString().replace(/\#EXT\-X\-PLAYLIST\-TYPE\:EVENT\n/,`#EXT-X-PLAYLIST-TYPE:EVENT\n#EXT-X-START:TIME-OFFSET=${offset/1000}\n`)
        stream = stream.toString().replace(/\#EXT\-X\-ENDLIST\n/g, '')
        stream = stream.toString().replace(/\#EXT\-X\-DISCONTINUITY\n/g, '')
        stream = stream.replace(/\n_/g,`\nchannels/${channel.slug}/_`)
        res.set({
          'Content-Type': 'application/x-mpegURL'
        })
        res.send(stream)
      } catch(e) {
        null
      }
      res.send()
  })

})

app.listen(port, async () => {
  log('We are broadcasting live at https://live.tedroddy.net!')
})