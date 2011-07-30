
var pressed = [];

$(function() {    
    $(document).keydown(function(e) {
        pressed.push(e.keyCode);
    });
});


/* Everything below here is canvas */
		
function createCanvas() {
    var canvasTimer;
    var WIDTH = 890;
	var HEIGHT = 180;
	var BG_COLOR = "#222";
	var STEP_TIME = 33;
	var DISPLAY_TIME = 4000;
	var MARKER_TIME = 150;
	var NOTE_TIME = 150;
	
	var CHARACTER_MAP = {
		65: 4,
		83: 3,
		68: 2,
		70: 1,
		71: 0
	};
	
	var INSTRUMENT_MAP = {
	    "guitar": 0, "bass_guitar": 1, "drums": 2, "special": 3
	}
    
	var canvas = $("#view")[0];
	canvas.width = WIDTH;
	canvas.height = HEIGHT;
	
	var ctx = canvas.getContext("2d");
	ctx.lineWidth = 5;
	ctx.fillStyle = BG_COLOR;
	ctx.fillRect(0, 0, WIDTH, HEIGHT);
	
	var hitKeys = {};
	
	function step() {
		var visible = [];
		var current = [];
		
		var elapsed = new Date().getTime() - startTime;
		var startDomain = elapsed - MARKER_TIME;
		var endDomain = elapsed - MARKER_TIME + DISPLAY_TIME;
		
		//finds notes within visibility
		for(var i=0; i<songMetadata.tracks.length; i++) {
			var fullNoteData = songMetadata.tracks[i];
			var startNote = fullNoteData[0];
			if(startNote > endDomain) continue;
			
			var endNote = startNote + NOTE_TIME;
			if(endNote < startDomain) continue;
			
			var myNote = fullNoteData[1 + INSTRUMENT_MAP[instrument]];
			if(myNote.length == 0) continue;
			
			var computedNoteData = [startNote, endNote, myNote];
			
			visible.push(computedNoteData);
			if(startNote < elapsed && endNote > elapsed) current.push(computedNoteData);
		}
		
		//draws background color and background lines
		for(var i=0; i<5; i++) {
			ctx.strokeStyle = BG_COLOR;
			var y = i * (HEIGHT - 32) / 4 + 16;
			ctx.beginPath();
			ctx.moveTo(0, y);
			ctx.lineTo(WIDTH, y);
			ctx.stroke();
		}
		
		//shows notes
		for(var i=0; i<visible.length; i++) {
			ctx.strokeStyle = 'green';
			var note = visible[i];
			var startNote = note[0];
			var endNote = note[1];
			var keys = note[2];
			
			for(var j=0; j<keys.length; j++) {
				var y = CHARACTER_MAP[keys[j]] * (HEIGHT - 32) / 4 + 16;
				ctx.beginPath();
				ctx.moveTo((startNote - startDomain) / DISPLAY_TIME * WIDTH, y);
				ctx.lineTo((endNote - startDomain) / DISPLAY_TIME * WIDTH, y);
				ctx.stroke();
			}
		}
		
		//shows marker
		ctx.strokeStyle = 'red';
		ctx.beginPath();
		ctx.moveTo(MARKER_TIME / DISPLAY_TIME * WIDTH, 0);
		ctx.lineTo(MARKER_TIME / DISPLAY_TIME * WIDTH, HEIGHT);
		ctx.stroke();
		
		
        
        for(var i=0; i<current.length; i++) {
          var part = current[i];
          
          for(var j=0; j<part[2].length; j++) {
              var note = part[2][j];
              
              if($.inArray(note, pressed) > -1) {
                msg('abbey-node/player/oops');
              }
          }
          pressed =[];
        }
	}
	
	var startTime = new Date().getTime();
	canvasTimer = setInterval(step, STEP_TIME);	    

return canvasTimer;
}

function createStars() {
    console.log("HOORAY!");
}