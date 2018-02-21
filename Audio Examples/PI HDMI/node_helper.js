'use strict';

const NodeHelper = require('node_helper');
const exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var fs = require("fs");
var titi = "";
var song = "";
var vol = "";

module.exports = NodeHelper.create({
  start: function() {
    	console.log("Starting module: " + this.name);
        exec("killall mpg123", null);
  }, 
 
  socketNotificationReceived: function(notification) {

	if (notification === "Radiostop") {
		exec("killall mpg123", null);
	}
	if (notification === "VolumeUp") {
		exec("amixer -q sset PCM 1000+", null);
	}
	if (notification === "VolumeDown") {
		exec("amixer -q sset PCM 1000-", null);
	}
	if (notification === "Mute") {
		exec("amixer -q sset PCM toggle", null);
	}
	if (notification === "Volu") {
		var lineReader = require("readline").createInterface({input: require("fs").createReadStream(this.path + "/VOL.log")});
		lineReader.on("line", function (line) {
		  var l = line.indexOf(" [");
		  var n = line.indexOf("] ");
		  if(l > -1) {
		    vol = line.substr(l + 2, n-l-2);
   	          }
		});
	        console.log("Volume: ", vol);
		this.sendSocketNotification("DATAV", vol);
	}
	if (notification === "Titel") {
		console.log("in RDS-Read");
		var lineReader = require("readline").createInterface({input: require("fs").createReadStream(this.path + "/RDS.log")});
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
		var lineReader = require("readline").createInterface({input: require("fs").createReadStream(this.path + "/RDS.log")});
		lineReader.on("line", function (line) {
		  var l = line.indexOf("ICY-META: StreamTitle=");
		  if(l > -1) {
		    song = line.substr(l + 23,line.length-25);
  	          }
		});
	        console.log(song);
		this.sendSocketNotification("DATAT", song);
	}
	if (notification === "On") {
		exec("xset -display :0.0 dpms force on", null);
	}
	if (notification === "Off") {
		exec("xset -display :0.0 dpms force off", null);
	}
	else {
		console.log(this.path);
		execSync(this.path + "/scripts/Vol.sh", null);
		exec(this.path + "/scripts/" + notification + ".sh", null);
	}
   }
  
});

	