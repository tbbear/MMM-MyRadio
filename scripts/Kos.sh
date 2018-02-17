#!/bin/bash

  killall mpg123

  sleep 0.1

  mpg123 -@ http://live.city93.gr:9996/stream 2>~/MagicMirror/modules/MMM-MyRadio/RDS.log
