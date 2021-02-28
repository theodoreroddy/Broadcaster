const SegmenterPool = require('../Utilities/SegmenterPool.js')
const Log = require('../Utilities/Log.js')
const FFMpeg = require('fluent-ffmpeg')
const path = require('path')
const tag = path.basename(__filename)
process.on('exit', SegmenterPool().flush)

const { VIDEO_CODEC,
        VIDEO_CRF,
        VIDEO_FILTER,
        AUDIO_CODEC,
        AUDIO_BITRATE,
        HLS_SEGMENT_LENGTH_SECONDS } = process.env

function FFMpegSession(channel) {
    process.on('exit', SegmenterPool().flush)
    const file = channel.queue[channel.currentPlaylistIndex].file
    const slug = channel.slug
    FFMpeg(file)
        .addOptions([
            `-c:v ${VIDEO_CODEC}`,
            `-crf ${VIDEO_CRF}`,
            `-vf ${VIDEO_FILTER}`,
            `-g ${AUDIO_CODEC}`,
            `-c:a ${AUDIO_BITRATE}`,
            `-b:a ${VIDEO_CRF}`,
            '-ac 2',
            '-f hls',
            `-hls_time ${HLS_SEGMENT_LENGTH_SECONDS}`,
            '-hls_flags append_list',
            '-hls_start_number_source datetime',
            '-hls_playlist_type event',
            '-sc_threshold 0'
        ]).output(`${CACHE_DIR}/broadcaster/channels/${slug}/_.m3u8`)
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
