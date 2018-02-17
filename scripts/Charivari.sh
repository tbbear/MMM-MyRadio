#!/bin/bash

  killall mpg123

  sleep 0.1

  mpg123 -@ http://www.charivari.de/stream1.m3u 2>~/MagicMirror/modules/MMM-MyRadio/RDS.log
