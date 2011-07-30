var fs = require("fs");
var _ = require("./underscore")._;

var SHEETS_DIR = __dirname + "/static/sheets";
var SONGS_DIR = __dirname + "/static/songs";
var NAME_VALIDATION_REGEX = /^[a-zA-Z0-9 _-]+$/;

//song names associated with existing sheets
var sheets = _.map(fs.readdirSync(SHEETS_DIR), function(file) {
    return file.substring(0, file.length - 5);
});

//song names associated with existing mp3's
var songs = _.map(fs.readdirSync(SONGS_DIR), function(file) {
    return file.substring(0, file.length - 4);
});

//legit songs, which must have both an mp3 and a sheet
var workingSongs = _.intersection(sheets, songs);

//validates a song name, which can only contain letters, numbers, spaces, underscores and dashes
function validateName(name) {
    if(name.match(NAME_VALIDATION_REGEX) == null) {
        console.error("Illegal song name:", name);
        return false;
    }
    
    return true;
}

function saveSheet(name, sheet) {
    if(!validateName(name)) return;
    
    var sheetFilePath = SHEETS_DIR + "/" + name + ".json";
    
    fs.writeFile(sheetFilePath, JSON.stringify(sheet), function(err) {
        if(err) {
            console.error("Could not save file " + sheetFilePath + ":", err);
        }
    });
}

function saveSong(name, songTempFilePath) {
    if(!validateName(name)) return;
    
    var songFilePath = SONGS_DIR + "/" + name + ".mp3";
    fs.rename(songTempFilePath, songFilePath);
}

exports.songs = workingSongs;
exports.saveSheet = saveSheet;
exports.saveSong = saveSong;