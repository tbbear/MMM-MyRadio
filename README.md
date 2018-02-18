# MMM-MyRadio
Radio Module for MM showing sender, RDS data and Soundvolume information

![](MMM-MyRadio.png)

## IMPORTANT!

This module requires that you have mpg123 installed.
To install it run : sudo apt-get install mpg123 

## How it works

The module plays up to 5 diff. Radiostations and if they show sender and RDS data also, u can select the station and the volume 
with ur mouse, touchpad or touchscreen, now also via MMM-voice.

The module is based on the idea and code of MMM-TouchPlayerBasic by Pierre Broberg

## Installation

* git clone https://github.com/tbbear/MMM-MyRadio into the `~/MagicMirror/modules` directory.

## Config.js entry and options

````javascript
{
	module: 'MMM-MyRadio',
		position: 'top_left',
		config: {
			stations: [
				"yourstation yourstation", // Separation by space, First part "yourstation" is the .png image filename, the second is .sh script name
				]
				...up to 5
		}

},
````

## Description

The volume and mute buttons are executing commands for the main ALSA mixer on your Computer (mainly designed for Ubuntu 17.10 with HDMI audio), for 
all other systems u have to modify the entries in node_helper.js;
This also means that if you have a voice-module that speaks to you or have notification/alarm sounds, you will change the volume of that as well.

mpg123 only supports m3u radio playlists files,
so if your choice of radiostation only has .pls playlists and/or AAC audio files this module won't work.

When you name your stations and playlists in the config, make sure you name your files exactly the same

	For an example:
	if you add "superradio superradio" to the config list
	your .sh file should be named superradio.sh and the Icon superradio.png

all .sh files should be placed in the "scripts" folder.
all .png image files should be placed in the "images" folder.

* Scriptfile .sh
	here is the script file explained :

		sudo killall mpg123  // this is so all previous mpg123 instances are stopped before starting a new one, this prevents multiple stations and files to be played simultaniously

		sleep 0.1 // a short pause between commands is needed for the killall to work

		mpg123 -@ http://streams.br.de/bayern1_2.m3u 2>~/MagicMirror/modules/MMM-MyRadio/RDS.log  // the http://... part is ur radio stream and make sure u always keep the rest as it is

Make sure the .sh script files you create are executable, otherwise the scripts will not run.
To make it executable via the terminal use : chmod +x filename.sh  

* Icons/images .png
	U should add your image file named LOGO.png in the images folder.
	For spacing purposes, the image has to be 60px wide.

* Configuration Example
	Remember the name of your .sh scriptfile should be exactly as the station you put in the config! 

````javascript
      {
	module: 'MMM-MyRadio',
		position: 'top_right',
		config: {
			stations: [
				"Bayern1 Bayern1", 
				"Bayern3 Bayern3",
				"Charivari Charivari",
				"Kos Kos",
				"AB AB"
				]

		}

      },

````
# V1.01
Now ready for MMM-voice
