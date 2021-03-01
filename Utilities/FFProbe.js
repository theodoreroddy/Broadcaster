const Log = require('./Log.js')
const Bash = require('child_process').execSync
const tag = 'FFProbe'

module.exports = {
    getDurationInMilliseconds: filePath => {
        const duration = Bash(`ffprobe "${filePath}"  2>&1 | grep -E '^ +Duration: ' | cut -d':' -f2- | cut -d, -f1`)
        const convert = duration.toString().split(':')
        const hours = convert[0]
        const minutes = convert[1]
        const seconds = convert[2]
        const total = parseFloat(seconds) + (parseFloat(minutes) * 60) + (parseFloat(hours) * 60*60)
        return total * 1000
    }
}