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
 
  socketNotificationReceived: function(notification, payload) {

	if (notification === "Radiostop") {
		exec("killall mpg123", null);
	}
	else if (notification === "VolumeUp") {
		exec("amixer -q -D pulse sset Master 10%+", null);
	}
	else if (notification === "VolumeDown") {
		exec("amixer -q -D pulse sset Master 10%-", null);
	}
	else if (notification === "Mute") {
		exec("amixer -q -D pulse sset Master toggle", null);
	}
	else if (notification === "VolumeSet") {
		exec("amixer -q -D pulse sset Master " + payload, null);
	}
	else if (notification === "Volu") {
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
	else if (notification === "Titel") {
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
	else if (notification === "Song") {
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
	else if (notification === "On") {
		exec("xset -display :0.0 dpms force on", null);
	}
	else if (notification === "Off") {
		exec("xset -display :0.0 dpms force off", null);
	}
	else if (notification === "ChannelSet") {
		exec(this.path + "/scripts/" + payload + ".sh", null);
		console.log("ChannelSet to " + payload + " executed");
	}
	else {
		console.log("Unknown notification received: " + notification);
	}
	execSync(this.path + "/scripts/Vol.sh", null);
   }
  
});

	
