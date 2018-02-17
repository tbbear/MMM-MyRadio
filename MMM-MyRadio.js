/* Magic Mirror
 * Module: MMM-MyRadio
 *
 *
 * MMM-MyRadio from tbbear based on code from MMM-TouchPlayerBasic by Pierre Broberg, based on code from MMM-Myvoiceradio by gismo2006
 * MIT Licensed.
 */


Module.register("MMM-MyRadio",{

// Default module config.
	defaults: {
		maxWidth: "100%",
		updateInterval: 10 * 1000, 
		stations: [
			"R radio", // Separation by space, First part "R" is the .png image filename, the second is .sh script name
		]

	},

	getStyles: function() {
		return ["MMM-MyRadio.css"];
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
          var self = this;
          this.scheduleUpdate();
          this.SText = "warte...";
	  this.TText = "...";
	  this.VText = "..%";
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

	// Override dom generator.
	getDom: function() {

		var self = this;
		var stationsArray = self.config.stations;
		var stationListWidth;
		if (stationsArray.length < 4) {stationListWidth = 292;}
		else {stationListWidth = ( stationsArray.length * 60 ) + 2;}

		var wrapper = document.createElement("div");
		wrapper.style.maxWidth = this.config.maxWidth;

				
  	        var stationMenu = document.createElement("div");
		stationMenu.className = "stationMenu";
		stationMenu.style.maxWidth = stationListWidth;

		var statindex;
		for (statindex = 0; statindex < stationsArray.length; ++statindex) {
			var strsplit = stationsArray[statindex].split(" ")
			let scriptfile = strsplit[1];
			var station = strsplit[1];
                        var statplace = (statindex * 1) * 60 + 1;
				station = document.createElement("div");
				station.innerHTML = '<img src="modules/MMM-MyRadio/images/' + strsplit[0] + '.png" style="cursor:pointer">';
				station.className = "button";
				station.style.left = statplace + "px";
				station.addEventListener("click", () => play(scriptfile));
				stationMenu.appendChild(station);
		};

		wrapper.appendChild(stationMenu);

		function play(scriptfile) {
			self.sendSocketNotification(scriptfile, {});
		};

		var topMenu = document.createElement("div");
			topMenu.className = "topMenu";
			topMenu.style.display = "block";

		var stopper = document.createElement("div");
			stopper.className = "button";
			stopper.innerHTML = '<img src="modules/MMM-MyRadio/images/stopButton.png" style="cursor:pointer"></img>';
			stopper.style.left = "1px";
			stopper.addEventListener("click", () => radiostop());

		function radiostop() {
			self.sendSocketNotification('Radiostop', {});
		};

		var volumeUp = document.createElement("div");
			volumeUp.className = "button";
			volumeUp.innerHTML = '<img src="modules/MMM-MyRadio/images/volumedownButton.png" style="cursor:pointer"></img>';
			volumeUp.style.left = "61px";
			volumeUp.addEventListener("click", () => volumecontrol('VolumeDown'));
		var volumeDown = document.createElement("div");
			volumeDown.className = "button";
			volumeDown.innerHTML = '<img src="modules/MMM-MyRadio/images/volumeupButton.png" style="cursor:pointer"></img>';
			volumeDown.style.left = "121px";
			volumeDown.addEventListener("click", () => volumecontrol('VolumeUp'));
		var volumeMute = document.createElement("div");
			volumeMute.className = "button";
			volumeMute.innerHTML = '<img src="modules/MMM-MyRadio/images/muteButton.png" style="cursor:pointer"></img>';
			volumeMute.style.left = "181px";
			volumeMute.addEventListener("click", () => volumecontrol('Mute'));
		var Leer = document.createElement("div");
	        	Leer.classList.add("small", "bright", "leer");
			Leer.innerHTML = "Vol:  <br>" + self.VText;
			Leer.style.left = "241px";

		function volumecontrol(action) {
			self.sendSocketNotification(action, {});
		};

		topMenu.appendChild(stopper);
		topMenu.appendChild(volumeUp);
		topMenu.appendChild(volumeDown);
		topMenu.appendChild(volumeMute);
		topMenu.appendChild(Leer);
		
		wrapper.appendChild(topMenu);

		var Sender = document.createElement("div");
		Sender.classList.add("small", "bright", "sender");
		Sender.innerHTML = self.SText;
		wrapper.appendChild(Sender);

		var Titel = document.createElement("div");
		Titel.classList.add("xsmall", "bright", "titel");
		Titel.innerHTML = self.TText;
		wrapper.appendChild(Titel);
		
		return wrapper;

	}

});
