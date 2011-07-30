/* Main Application File.  Order is important! */

/**
 * Checks to see if the timestamp lies within the leeway.
 *
 * @param timestamp The timestamp of the keypress.
 * @return boolean
 */
function checkRange(timestamp) {
  return timestamp >= counter - constants.LEEWAY && timestamp <= counter + constants.LEEWAY;
}

/**
 * Given a keycode, determine if you successfully hit a note.
 * if tick contains a note from the player's instrument
 *   if keycode exists within the tick and the keypress is within acceptable limits
 *     user succeeds, remove the tick and log a success.
 *
 * @return boolean
 */
function checkKeypress(keyCode) {
  if(nextTick[instrument].length > 0) {
    var tmpKc = $.inArray(keyCode, nextTick[instrument])
    if ((tmpKc > -1) && (checkRange(nextTick[0]))) {
      nextTick[instrument][tmpKc] = -1;
    }
  }
  console.log(counter + ", " + keyCode);
}

/**
 * Checks to see if the tick for the user has passed.  If it has, register a note failed event.
 * @return boolean
 */
function checkNextTick() {
  if(!nextTick) {
    console.log("No next tick found. Quitting.");
    stopCounter();
    return false;
  }
  var total = 0;
  $.each(nextTick[instrument], function() {
    total += this;
  });
  if(total == nextTick[instrument].length * -1) {
    noteSuccess();
  } else if(nextTick[0] < (constants.LEEWAY + counter)) {
    noteFailure();
  }
}

/**
 * Increases the counter by TICK_INTERVAL milliseconds
 */
function incrementCounter() {
  // Increment counter, then check for the next tick.
  checkNextTick();
  $('#ticker').text(counter);
  counter += constants.TICK_INTERVAL;
}

/**
 * Removes the tick, sets nextTick.
 */
function getNextTick() {
  console.log(song.length);
  if(song.length > 0) {
    song.shift();
    nextTick = song[0];
  } else {
    console.log("Nothing left.");
    stopCounter();
  }
}

function ddd() {
  console.log("Debug Information");
  console.log("Counter: " + counter + "\nCurrent tick: ");
  console.log(nextTick);
  return false;
}

/**
 * Stops the song counter.
 */
function stopCounter() {
  clearInterval(counterId);
  console.log("Counter stopped.");
  $("input").unbind('keydown');
}

/**
 * Logs a successfully hit note.
 */
function noteSuccess() {
  getNextTick();
  console.log("Note success! Now try and hit " + nextTick[instrument]  + " at " + nextTick[0]);
};

/**
 * Logs a failed keypress.
 */
function noteFailure() {
  getNextTick();
  console.log("Note failure");
}

/**
 * Start playing!
 */
function startPlaying() {
  console.log("First tick, you should try and hit " + nextTick[instrument] + " at " + nextTick[0]);
  // Increment the counter by TICK_INTERVAL.
  state = stateMapping.PLAYING;
  counterId = setInterval(incrementCounter, constants.TICK_INTERVAL);
}

/* MAIN STUFF GOES HERE LOL */
$(document).ready(function() {


  /* Important variables */
  /**
   * Data structure of our music sheet.
   * [
   *   [tick, [keycode, keycode], [keycode], []]
   * ]
   * Ticks can be anything in ms and are in index 0.
   * Instruments are listed below and have keycodes stored.
   * If nothing happens then the array for the instrument is empty (but still exists).
   */
  var instrumentMapping = {
    GUITAR:1,
    BASS:2,
    DRUMS:3,
    COWBELL:4,
    VOICE:5
  };

  var stateMapping = {
    PLAYING:1,
    STOPPED:-1
  };

  /* IMPORTANT!  These counters are kind of a big deal. */
  var counter = 0;
  var song = [
    [4000,[65],[],[],[],[]] // 4000, g(a)
  , [6000,[74, 70],[],[],[],[]] // 6000, g(fj)
  ];

  var instrument;
  var constants = {
    TICK_INTERVAL: 100,
    LEEWAY: 200
  }
  var counterId;
  var nextTick;
  var state;
  // Setup:
  // 1. Set nextTick.
  nextTick = song[0];
  // 2. Set user instrument.
  instrument = instrumentMapping.GUITAR;

  $("input").keydown(function(event) {
    checkKeypress(event.keyCode);
  });
});

