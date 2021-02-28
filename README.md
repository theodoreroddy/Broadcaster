# Broadcaster
Generate and host HTTP Live Streams from local video content using FFMpeg. Broadcaster will create playlists of your video files and live stream the playlist. It will orchestrate time keeping to make sure anyone watching your stream is in the same position. If no one is watching, the timeline keeps going, just like a old school TV stations.

# Prerequisites
* Broadcaster uses FFMpeg to encode your videos to h264 for HTTP Live Streaming.
* If you have an Nvidia GPU, it is highly recommended you have `ffmpeg` compiled with Nvidia's non-free `h264_nvenc` codec.
* If you have an Intel CPU with Intel QuickSync, you can try the `h264_qsv` codec.
* Without either of these, you'll have to use a software codec like `libx264` which may not be able to keep up in real time. You can set the codec in the config.txt.

# Getting Started

Clone the repository:
```
git clone https://github.com/theodoreroddy/Broadcaster.git
```

Change into the Broadcaster directory and run `npm install`:
```
cd ./Broadcaster
npm install
```

Define your channels in a `.json` file:
```
[{
  "type": "shuffle",
  "name": "My Channel",
  "slug": "mychannel",
  "paths": [
    "/path/to/videos.mkv"
  ]
}]
``` 

The `type` specifies the playlist type:
* `shuffle`: will shuffle the files and play them in a random order.
* `alphabetical`: will play the files back in alphabetical order.
* `tv`: will look for S##E## codes in the file name and create a playlist cycling throw shows and starting each of them from the first episode. Provide paths for multiple TV shows to use this.

The `name` is a human readable name for the channel and the `slug` specifies the directory name the channel.

Start your server:
```
node Broadcaster.js ChannelList.json
```