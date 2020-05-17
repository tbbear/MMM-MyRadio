/* Magic Mirror
 * Module: MMM-MyRadio
 *
 *
 * MMM-MyRadio from tbbear based on code from MMM-TouchPlayerBasic by Pierre Broberg, based on code from MMM-Myvoiceradio by gismo2006
 * MIT Licensed.
 */

var statix = 0;

// function to get next channel script name
function getNextChannel(configInstance) {
	let stationsArray = configInstance.stations;
	let strsplit = stationsArray[statix].split(" ")
	let scriptfile = strsplit[1];
	
	// increment global variable
	statix++;
	if (statix === 4) {
		statix = 0;
	}
	return scriptfile;
};
Module.register("MMM-MyRadio",{

// Default module config.
	defaults: {
		maxWidth: "100%",
		updateInterval: 10 * 1000, 
		stations: [
			"Bayern1 Bayern1", // Example
			"R radio", // Separation by space, First part "R" is the .png image filename, the second is .sh script name
		],
		autoplay: false,
		volume: "100%",
		showControls: true
	},

	getStyles: function() {
		return ["MMM-MyRadio.css"];
	},
	
	scheduleUpdate: function() {
		setInterval(() => {
			this.sendSocketNotification("Titel", this.config);
			this.sendSocketNotification("Song", this.config);
			this.sendSocketNotification("Volu", this.config);
		}, this.config.updateInterval);
	},

         // Define start sequence.
        start: function() {
          Log.info("Starting module: " + this.name);
  
          // Set locale.
//          var self = this;
          this.scheduleUpdate();
          this.SText = "warte...";
	  this.TText = "...";
	  this.VText = "..%";
	  this.volumeSet(this.config.volume);
	  if(this.config.autoplay === true) {
		this.play(getNextChannel(this.config));
	  }
        },

	play: function(scriptfilename) {
		this.sendSocketNotification("ChannelSet", scriptfilename);
	},

	volumeSet: function(volume) {
		this.sendSocketNotification("VolumeSet", volume);
	},

	radioStop: function() {
		this.sendSocketNotification('Radiostop');
	},
	
	volumeControl: function(action) {
		let socketCommand = "";
		switch(action) {
			case "up":
				socketCommand = "VolumeUp";
				break;
			case "down":
				socketCommand = "VolumeDown";
				break;
			case "mute":
				socketCommand = "Mute";
				break;
			default:
				Log.error("Received invalid volume command: "+action);
		}
		if(socketCommand!=="") {
			this.sendSocketNotification(socketCommand);
		}
	},

	processSText: function(data) {
         	this.SText = data;
		this.updateDom();
	},

	processVText: function(data) {
         	this.VText = data;
		this.updateDom();
	},

	processTText: function(data) {
         	this.TText = data;
		this.updateDom();
	},

	socketNotificationReceived: function(notification, payload) {
	    if(notification === "DATAS"){
 		this.processSText(payload);
       	    }
	    if(notification === "DATAT"){
  		this.processTText(payload);
	    }
	    if(notification === "DATAV"){
  		this.processVText(payload);
	    }
	},
	
	notificationReceived: function(notification, payload) {
            if (notification === "HIDE_RADIO") {
         	this.hide(1000);
                this.updateDom(300);
            }
	    if (notification === "SHOW_RADIO") {
                this.show(1000);
                this.updateDom(300);
            }
	    if (notification === "NEXT_RADIO"){
		this.play(getNextChannel(this.config));
            }
	    if (notification === "RADIO_STOP"){
                this.sendSocketNotification("Radiostop", {});
            }
            if (notification === "VOLUME_UP"){
                this.sendSocketNotification("VolumeUp", {});
            }
            if (notification === "VOLUME_DOWN"){
                this.sendSocketNotification("VolumeDown", {});
            }
            if (notification === "VOLUME_MUTE"){
                this.sendSocketNotification("Mute", {});
            }
            if (notification === "MIRROR_SLEEP"){
                this.sendSocketNotification("Off", {});
            }
            if (notification === "MIRROR_WAKE"){
                this.sendSocketNotification("On", {});
            }
	},

	// Override dom generator.
	getDom: function() {

		let self = this;
		let stationsArray = self.config.stations;
		let stationListWidth;
		if (stationsArray.length < 4) {stationListWidth = 292;}
		else {stationListWidth = ( stationsArray.length * 60 ) + 2;}

		let wrapper = document.createElement("div");
		wrapper.style.maxWidth = this.config.maxWidth;

				
  	        let stationMenu = document.createElement("div");
		stationMenu.className = "stationMenu";
		stationMenu.style.maxWidth = stationListWidth;

		for (let statindex = 0; statindex < stationsArray.length; statindex++) {
			let strsplit = stationsArray[statindex].split(" ")
			let scriptfile = strsplit[1];
			let station = strsplit[1];
			let statplace = (statindex) * 60 + 1;
			station = document.createElement("div");
			station.innerHTML = '<img src="modules/MMM-MyRadio/images/' + strsplit[0] + '.png" style="cursor:pointer">';
			station.className = "button";
			station.style.left = statplace + "px";
			station.addEventListener("click", () => self.play(scriptfile));
			stationMenu.appendChild(station);
		}

		wrapper.appendChild(stationMenu);

		let showControls = this.config.showControls;

		if(showControls === true) {
			let topMenu = document.createElement("div");
			topMenu.className = "topMenu";
			topMenu.style.display = "block";

			let stopper = document.createElement("div");
			stopper.className = "button";
			stopper.innerHTML = '<img src="modules/MMM-MyRadio/images/stopButton.png" style="cursor:pointer"></img>';
			stopper.style.left = "1px";
			stopper.addEventListener("click", () => self.radioStop());

			let volumeUp = document.createElement("div");
			volumeUp.className = "button";
			volumeUp.innerHTML = '<img src="modules/MMM-MyRadio/images/volumedownButton.png" style="cursor:pointer"></img>';
			volumeUp.style.left = "61px";
			volumeUp.addEventListener("click", () => self.volumeControl('down'));

			let volumeDown = document.createElement("div");
			volumeDown.className = "button";
			volumeDown.innerHTML = '<img src="modules/MMM-MyRadio/images/volumeupButton.png" style="cursor:pointer"></img>';
			volumeDown.style.left = "121px";
			volumeDown.addEventListener("click", () => self.volumeControl('up'));

			let volumeMute = document.createElement("div");
			volumeMute.className = "button";
			volumeMute.innerHTML = '<img src="modules/MMM-MyRadio/images/muteButton.png" style="cursor:pointer"></img>';
			volumeMute.style.left = "181px";
			volumeMute.addEventListener("click", () => self.volumeControl('mute'));

			let Leer = document.createElement("div");
		        Leer.classList.add("small", "bright", "leer");
			Leer.innerHTML = "Vol:  <br>" + self.VText;
			Leer.style.left = "241px";


			topMenu.appendChild(stopper);
			topMenu.appendChild(volumeUp);
			topMenu.appendChild(volumeDown);
			topMenu.appendChild(volumeMute);
			topMenu.appendChild(Leer);
		
			wrapper.appendChild(topMenu);
		}

		let Sender = document.createElement("div");
		Sender.classList.add("small", "bright", "sender");
		Sender.innerHTML = self.SText;
		wrapper.appendChild(Sender);

		let Titel = document.createElement("div");
		Titel.classList.add("xsmall", "bright", "titel");
		Titel.innerHTML = self.TText;
		wrapper.appendChild(Titel);
		
		return wrapper;
	}

});
