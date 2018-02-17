#!/bin/bash

  sudo killall mpg123

  sleep 0.1

  mpg123 -Z -@ /home/pi/MagicMirror/modules/MMM-TouchPlayerBasic/music/playlist.m3u
