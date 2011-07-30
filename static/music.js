
// var buzz = require('buzz');

// number keys select track (beats, guitar, drum, bass, (cowbell))
var instrument = 0;
var instrumentString = "";

var beatCount = 0;
var guitarCount = 0;
var bassCount = 0;
var drumCount = 0;
var cowbellCount = 0;

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

function lookupInstrumentString(instrument)
{
    switch(instrument)
    {
        case 0: return "Beat setter"
        case 1: return "Guitar"
        case 2: return "Bass"
        case 3: return "Drums"
        case 4: return "Cowbell"
        default: return "More Cowbell!"
    }
}

function incrementInstrumentCount(instrument)
{
    switch(instrument)
    {
        case 0: 
            beatCount++;
            break;
        case 1: 
            guitarCount++;
            break;
        case 2: 
            bassCount++;
            break;
        case 3: 
            drumCount++;
            break;
        case 4: 
            cowbellCount++;
            break;
    }
}

function updateDisplayedData()
{
    $('#instrument').text("Instrument: " + instrumentString);
    $('#beat_count').text("Number of beats: " + beatCount);
    $('#guitar_count').text("Number of guitar notes: " + guitarCount);
    $('#bass_count').text("Number of bass notes: " + bassCount);
    $('#drum_count').text("Number of drum notes: " + drumCount);
    $('#cowbell_count').text("Number of cowbell... hits?: " + cowbellCount);
    
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
            instrumentString = lookupInstrumentString(instrument)
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
        else if(event.keyCode == 77)
        {
            // <M>
            submit();
        }
        else if(event.keyCode == 82)
        {
            // <R>
            isPlaying = false;
            song.stop();
        } 
        else
        {
            // record timestamp
            console.log("instrument: " + instrument);
            tracks[instrument].push([song.getTime()*1000, event.keyCode]);
            incrementInstrumentCount(instrument);
        }
        // update fields on page
        updateDisplayedData();
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


function submit()
{
    var matchedBeats = matchBeats();
    console.log("Printing JSON:\n******************\n");
    console.log(JSON.stringify(matchedBeats));
    console.log(matchedBeats);
    var lyrics = $('#musicLyrics').val();
    console.log("lyrics: " + lyrics);
    var sheet = { tracks : matchedBeats, lyrics : lyrics }    // /api/sheet
    // name, sheet params
    $.post("api/sheet", { name: songName, sheet: JSON.stringify(sheet)},
                    function(data){
                        console.log("Returned with: " + data)
                 });

}

