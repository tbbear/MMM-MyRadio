#!/bin/bash

  killall mpg123

  sleep 0.1

  mpg123 -@ http://wdr-wdr5-live.icecast.wdr.de/wdr/wdr5/live/mp3/128/stream.mp3 2>~/MagicMirror/modules/MMM-MyRadio/RDS.log
