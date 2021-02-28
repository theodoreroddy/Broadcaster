# Broadcaster
Node app that generates and hosts HTTP Live Streams from local content using FFMpeg and ExpressJS.

# Prerequisites
* It is highly recommended you have ffmpeg compiled with nvenc codec. Without it, you'll have to use a software codec and ffmpeg may not be able to keep up in real time depending on your CPU. You can set the codec in the config.txt. Default is nvenc, but you could try libx264 or h264_qsv if you have an Intel CPU with Intel QuickSync.

# Getting Started
Start by making sure you have ffmpeg with nvenc enabled