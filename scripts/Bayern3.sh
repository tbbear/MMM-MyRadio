#!/bin/bash

  killall mpg123

  sleep 0.1

  mpg123 -@ http://streams.br.de/bayern3_2.m3u 2>~/MagicMirror/modules/MMM-MyRadio/RDS.log

