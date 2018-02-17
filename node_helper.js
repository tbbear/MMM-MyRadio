'use strict';

const NodeHelper = require('node_helper');
const exec = require('child_process').exec;
var fs = require("fs");
var titi = "";
var song = "";

module.exports = NodeHelper.create({
  start: function() {
    	console.log("Starting module: " + this.name);
  }, 
 
  socketNotificationReceived: function(notification) {

	if (notification === "Radiostop") {
		exec("killall mpg123", null);
	}
	if (notification === "VolumeUp") {
		exec("amixer -q -D pulse sset Master 10%+", null);
	}
	if (notification === "VolumeDown") {
		exec("amixer -q -D pulse sset Master 10%-", null);
	}
	if (notification === "Mute") {
		exec("amixer -q -D pulse sset Master toggle", null);
	}
	if (notification === "Titel") {
		console.log("in RDS-Read");
		var lineReader = require("readline").createInterface({input: require("fs").createReadStream("/home/robert/MagicMirror/modules/MMM-MyRadio/RDS.log")});
		lineReader.on("line", function (line) {
		  var l = line.indexOf("ICY-NAME: ");
		  if(l > -1) {
		    titi = line.substr(l + 10);
   	          }
		});
	        console.log(titi);
		this.sendSocketNotification("DATAS", titi);
	}
	if (notification === "Song") {
		console.log("in RDS-Read");
		var lineReader = require("readline").createInterface({input: require("fs").createReadStream("/home/robert/MagicMirror/modules/MMM-MyRadio/RDS.log")});
		lineReader.on("line", function (line) {
		  var l = line.indexOf("ICY-META: StreamTitle=");
		  if(l > -1) {
		    song = line.substr(l + 23,line.length-25);
  	          }
		});
	        console.log(song);
		this.sendSocketNotification("DATAT", song);
	}
	else {
		exec("/home/robert/MagicMirror/modules/MMM-MyRadio/scripts/" + notification + ".sh", null);
	}
   }
  
});

	