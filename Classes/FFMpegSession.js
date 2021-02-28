const SegmenterPool = require('../Utilities/SegmenterPool.js')
const Log = require('../Utilities/Log.js')
const FFMpeg = require('fluent-ffmpeg')
const path = require('path') 
const tag = path.basename(__filename)
process.on('exit', SegmenterPool().flush)

function FFMpegSession(channel) {
    process.on('exit', SegmenterPool().flush)
    const file = channel.queue[channel.currentPlaylistIndex].file
    const slug = channel.slug
    FFMpeffmpeg(file)
        .addOptions([
            '-c:v h264_nvenc',
            '-crf 21',
            '-vf yadif',
            '-g 24',
            '-c:a aac',
            '-b:a 128k',
            '-ac 2',
            '-f hls',
            '-hls_time '+clipLength,
            '-hls_flags append_list',
            '-hls_start_number_source datetime',
            '-hls_playlist_type event',
            '-sc_threshold 0'
        ]).output(`${__dirname}/Webapp/channels/${slug}/_.m3u8`)
        .on('start', function() {
            if (channel.currentPlaylistIndex == 0) channel.startTime = Date.now()
            Log(tag, channel, `FFMpeg started encoding ${file}.`)
        })
        .on('end', () => {
            channel.currentPlaylistIndex++
            Log(tag, channel, `FFMpeg finished encoding ${file} in ${(Date.now() - start)/1000} seconds.`)
        })
        .on('error', function (err, stdout, stderr) {
            channel.currentPlaylistIndex++
            Log(tag, channel, `FFMpeg produced an error, so we're skipping to ${file}.`)
        })
        .run()

}

module.exports = {
    FFMpegSession: FFMpegSession
}