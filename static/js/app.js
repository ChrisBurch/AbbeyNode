// /* Main Application File.  Order is important! */
// 
// /**
//  * Checks to see if the timestamp lies within the leeway.
//  *
//  * @param timestamp The timestamp of the keypress.
//  * @return boolean
//  */
// function checkRange(timestamp) {
//   return timestamp >= counter - constants.LEEWAY && timestamp <= counter + constants.LEEWAY;
// }
// 
// /**
//  * Given a keycode, determine if you successfully hit a note.
//  * if tick contains a note from the player's instrument
//  *   if keycode exists within the tick and the keypress is within acceptable limits
//  *     user succeeds, remove the tick and log a success.
//  *
//  * @return boolean
//  */
// function checkKeypress(keyCode) {
//   if(nextTick[instrument].length > 0) {
//     var tmpKc = $.inArray(keyCode, nextTick[instrument])
//     if ((tmpKc > -1) && (checkRange(nextTick[0]))) {
//       nextTick[instrument][tmpKc] = -1;
//     }
//   }
//   console.log(counter + ", " + keyCode);
// }
// 
// /**
//  * Checks to see if the tick for the user has passed.  If it has, register a note failed event.
//  * @return boolean
//  */
// function checkNextTick() {
//   if(!nextTick) {
//     console.log("No next tick found. Quitting.");
//     stopCounter();
//     return false;
//   }
//   var total = 0;
//   $.each(nextTick[instrument], function() {
//     total += this;
//   });
//   if(total == nextTick[instrument].length * -1) {
//     noteSuccess();
//   } else if(nextTick[0] < (constants.LEEWAY + counter)) {
//     noteFailure();
//   }
// }
// 
// /**
//  * Increases the counter by TICK_INTERVAL milliseconds
//  */
// function incrementCounter() {
//   // Increment counter, then check for the next tick.
//   checkNextTick();
//   $('#ticker').text(counter);
//   counter += constants.TICK_INTERVAL;
// }
// 
// /**
//  * Removes the tick, sets nextTick.
//  */
// function getNextTick() {
//   console.log(song.length);
//   if(song.length > 0) {
//     song.shift();
//     nextTick = song[0];
//   } else {
//     console.log("Nothing left.");
//     stopCounter();
//   }
// }
// 
// function ddd() {
//   console.log("Debug Information");
//   console.log("Counter: " + counter + "\nCurrent tick: ");
//   console.log(nextTick);
//   return false;
// }
// 
// /**
//  * Stops the song counter.
//  */
// function stopCounter() {
//   clearInterval(counterId);
//   console.log("Counter stopped.");
//   $("input").unbind('keydown');
//   clearInterval(canvasTimerObj);
// }
// 
// /**
//  * Logs a successfully hit note.
//  */
// function noteSuccess() {
//   getNextTick();
//   console.log("Note success! Now try and hit " + nextTick[instrument]  + " at " + nextTick[0]);
// };
// 
// /**
//  * Logs a failed keypress.
//  */
// function noteFailure() {
//   getNextTick();
//   console.log("Note failure");
// }
// 
// /**
//  * Start playing!
//  */
// function startPlaying() {
//   console.log("First tick, you should try and hit " + nextTick[instrument] + " at " + nextTick[0]);
//   // Increment the counter by TICK_INTERVAL.
//   state = stateMapping.PLAYING;
//   counterId = setInterval(incrementCounter, constants.TICK_INTERVAL);
//   canvasTimerObj = createCanvas();
// }
// 
// /* MAIN STUFF GOES HERE LOL */
// $(document).ready(function() {
//          var canvasTimerObj;
//        /* Important variables */
//        /**
//         * Data structure of our music sheet.
//         * [
//         *   [tick, [keycode, keycode], [keycode], []]
//         * ]
//         * Ticks can be anything in ms and are in index 0.
//         * Instruments are listed below and have keycodes stored.
//         * If nothing happens then the array for the instrument is empty (but still exists).
//         */
//        var instrumentMapping = {
//          GUITAR:1,
//          BASS:2,
//          DRUMS:3,
//          COWBELL:4,
//          VOICE:5
//        };
// 
//        var stateMapping = {
//          PLAYING:1,
//          STOPPED:-1
//        };
// 
//        /* IMPORTANT!  These counters are kind of a big deal. */
//        var counter = 0;
//        var song = [
//          [4000,[65],[],[],[],[]] // 4000, g(a)
//        , [6000,[74, 70],[],[],[],[]] // 6000, g(fj)
//        ];
// 
//        var instrument;
//        var constants = {
//          TICK_INTERVAL: 100,
//          LEEWAY: 200
//        }
//        var counterId;
//        var nextTick;
//        var state;
//        // Setup:
//        // 1. Set nextTick.
//        nextTick = song[0];
//        // 2. Set user instrument.
//        instrument = instrumentMapping.GUITAR;
// 
//        $("input").keydown(function(event) {
//          checkKeypress(event.keyCode);
//        });
// });

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
			console.log(fullNoteData, instrument, 1 + INSTRUMENT_MAP[instrument]);
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
		
		console.log(pressed, _.uniq(_.flatten(_.map(current, function(c) {
		    return c[2];
		}))));
		
		var fuckups = _.difference(pressed, _.uniq(_.flatten(_.map(current, function(c) {
		    return c[2];
		}))));
		
		if(fuckups.length > 0) {
		    msg("abbey-node/player/oops");
		}
	}
	
	var startTime = new Date().getTime();
	canvasTimer = setInterval(step, STEP_TIME);	    

return canvasTimer;
}