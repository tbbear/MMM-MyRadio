# MMM-MyRadio
Radio Module for MM showing sender, RDS data and Soundvolume information

![](MMM-MyRadio.png)

## IMPORTANT!

This module requires that you have mpg123 installed.
To install it run : sudo apt-get install mpg123 

## How it works

The module plays up to 4 diff. Radiostations and if they show sender and RDS data also, u can select the station and the volume 
with ur mouse or touchscreen, soon also via MMM-voice.

The module is based on the idea and code of MMM-TouchPlayerBasic by Pierre Broberg

## Installation

* git clone https://github.com/tbbear/MMM-MyRadio` into the `~/MagicMirror/modules` directory.

## Config.js entry and options

{
	module: 'MMM-TouchPlayerBasic',
		position: 'bottom_right',
		config: {
			stations: [
				"R radio", // Separation by space, First part "R" is the .png image filename, the second is .sh script name
				"P playlist" // The default icons are R for radiostation and P for playlist icon.
				]

		}

},


