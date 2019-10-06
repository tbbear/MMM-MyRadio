#!/bin/bash

  killall mpg123

  sleep 0.1

  mpg123 -@ http://wdr-wdr2-ruhrgebiet.icecast.wdr.de/wdr/wdr2/ruhrgebiet/mp3/128/stream.mp3 2>~/MagicMirror/modules/MMM-MyRadio/RDS.log
