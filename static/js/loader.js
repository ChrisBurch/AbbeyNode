$(function() {
    var syncCounter = 0;
	
	socket.on('connect', function() {
	    syncUp();
	});
	
	$.ajax({
		type: "POST",
		url: "/api/init",
		dataType: "json",
		data: {name : prompt("What is your name?")},
		
		success: function(json) {
			playerId = json.playerId;
			stageId = json.stageId;
			instrument = json.instrument;
			song = json.song;
			syncUp();
			loadMusic();
			loadMetadata();
		}
	});
	
	function syncUp() {
	    syncCounter++;
	    if(syncCounter == 4) msg("abbey-node/player/ready");
	}
	
	function loadMusic() {
		songTrack = new buzz.sound("songs/" + song + ".mp3");
		var fired = false;
		
		songTrack.bind("canplaythrough", function(e) {
		    if(!fired) {
		        syncUp();
		        fired = true;
		    }
		});
		
		songTrack.load();
	}
	
	function loadMetadata() {
        $.ajax({
    		type: "GET",
    		url: "/sheets/" + song + ".json",
    		dataType: "json",

    		success: function(json) {
    		    songMetadata = JSON.parse(json);
    			syncUp();
    		}
    	});
	}
});