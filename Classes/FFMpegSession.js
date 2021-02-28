const Log = require('../Utilities/Log.js')
const FFMpeg = require('fluent-ffmpeg')
const { CACHE_DIR } = process.env.SUPPORTED_FORMATS
const tag = 'FFMpegSession'

const { VIDEO_CODEC,
        VIDEO_CRF,
        VIDEO_FILTER,
        AUDIO_CODEC,
        AUDIO_BITRATE,
        HLS_SEGMENT_LENGTH_SECONDS } = process.env

function FFMpegSession(channel) {
    // const file = channel.queue[channel.currentPlaylistIndex]
    // const slug = channel.slug
    // FFMpeg(file)
    //     .videoCodec(VIDEO_CODEC)
    //     .videoFilters([VIDEO_FILTER])
    //     .audioCodec(AUDIO_CODEC)
    //     .audioBitrate(AUDIO_BITRATE)
    //     .audioChannels(2)
    //     .format('hls')
    //     .addOptions([
    //         `-crf ${VIDEO_CRF}`,
    //         `-hls_time ${HLS_SEGMENT_LENGTH_SECONDS}`,
    //         '-hls_flags append_list',
    //         '-hls_start_number_source datetime',
    //         '-hls_playlist_type event',
    //         '-sc_threshold 0'
    //     ]).output(`${CACHE_DIR}/broadcaster/channels/${slug}/_.m3u8`)
    //     .on('start', function() {
    //         if (channel.currentPlaylistIndex == 0) channel.startTime = Date.now()
    //         Log(tag, `FFMpeg started encoding ${file}.`, channel)
    //     })
    //     .on('end', () => {
    //         channel.currentPlaylistIndex++
    //         Log(tag, `FFMpeg finished encoding ${file} in ${(Date.now() - start)/1000} seconds.`, channel)
    //     })
    //     .on('error', function (err, stdout, stderr) {
    //         channel.currentPlaylistIndex++
    //         Log(tag, `FFMpeg produced an error, so we're skipping to ${file}.`, channel)
    //         Log(tag, err, channel)
    //     })
    //     .run()

}

module.exports = {
    FFMpegSession: FFMpegSession
}
