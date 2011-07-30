
// var buzz = require('buzz');

// number keys select track (beats, guitar, drum, bass, (cowbell))
var instrument = 0;
var numInstruments = 5;

var canStartPlaying = false;

var songName = getParameterByName('name');

var song = new buzz.sound( "http://" + window.location.host + "/songs/" + songName + ".mp3");
song.bind("canplaythrough", function(e) {
    canStartPlaying = true;
    console.log("Can start playing! yay!");
});

song.load();

var isPlaying = false;

var tracks = [[],[],[],[],[]];

function getInstrumentCode(keyCode)
{
    return keyCode - 49;
}

$(function() {
    console.log("In bootup function");
    
    $(window).keydown(function(event){
        var instrumentCode = getInstrumentCode(event.keyCode);
        console.log("Key Pressed!");
        if(instrumentCode >= 0 && instrumentCode < numInstruments)
        {
            console.log("Setting instrument: " + instrumentCode);
            instrument = instrumentCode;
        }
        else if(event.keyCode == 13)
        {
            // <ENTER>
            // START
            // 
            console.log("Pressed enter!");
            if (canStartPlaying == false)
                return;
            if(isPlaying)
            {
                song.pause();
                isPlaying = false;
            }
            else
            {
                song.play();
                isPlaying = true;
            }
        }
        else if(event.keyCode == 82)
        {
            // <R>
            isPlaying = false;
            song.stop();
        }
        else if(event.keyCode == 77)
        {
            // <M>
            // match to beats, spit out JSON
            var matchedBeats = matchBeats();
            printJSONTracks(matchedBeats);
        }
        else
        {
            // record timestamp
            console.log("instrument: " + instrument);
            tracks[instrument].push([song.getTime()*1000, event.keyCode]);
        }
    });
    
    
});

function matchBeats()
{
    var matchedTrack = [];
    var beats = tracks[0]
    beats.forEach(function(beat){
        
        var beatData = [];
        var timestamp = beat[0];
        // push the beat timestamp
        beatData.push(timestamp);
        // for each instrument, find the notes that are close to that beat timestamp
        // and add those to beatData
        var i = 0;
        tracks.forEach(function(track){
            if (i>0)
            {
                beatData.push(findMatchingBeats(track, timestamp));
            }
            i+=1;
        });
        matchedTrack.push(beatData);
    });
    return matchedTrack;
}

function findMatchingBeats(track, timestamp)
{
    matchingBeats = [];
    var i;
    for(i=0; i<track.length; i++)
    {
        var beat = track[i];
        var beatTimestamp = beat[0];
        var difference = beatTimestamp - timestamp;
        // console.log("Difference: " + difference);
        if(Math.abs(difference) <= 100)
        {
            // console.log("This difference is close enough!");
            matchingBeats.push(beat[1]);
        }
        if(difference > 100)
            break;
    }
        
    // console.log("Matching beats for timestamp: " + timestamp + ": " + matchingBeats);
    return matchingBeats;
}


function printJSONTracks(matchedBeats)
{
    console.log("Printing JSON:\n******************\n");
    console.log(JSON.stringify(matchedBeats));
    console.log(matchedBeats);
    
    // /api/sheet
    // name, sheet params
    $.post("api/sheet", { name: songName, sheet: JSON.stringify(matchedBeats)},
                    function(data){
                        console.log("Returned with: " + data)
                 });

}

