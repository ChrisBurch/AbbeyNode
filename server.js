var express = require("express");
var form = require("connect-form");
var querystring = require("querystring");

var _ = require("./underscore")._;
var model = require("./model");
var songs = require("./songs");

var app = express.createServer();
var io = require("socket.io").listen(app);

var SONG_UPLOAD_REDIRECT_URL = '/musicmaker.html'

app.configure(function() {
    app.use(express.static(__dirname + '/static'));
    app.use(express.logger());
    app.use(form({ keepExtensions: true }));
});

//Test page endpoint
app.get('/', function(request, response) {
    response.render('index.html');
});

//Normal api endpoints
app.post('/api/init', formCallback(function(request, response, fields, files) {
    var special = "special" == fields.instrument;
    response.send(addPlayer(fields.name, special));
}));

app.post('/api/sheet', formCallback(function(request, response, fields, files) {
    songs.saveSheet(fields.name, fields.sheet);
}));

app.post('/api/song', formCallback(function(request, response, fields, files) {
    songs.saveSong(fields.name, files.song.path);
    response.redirect(SONG_UPLOAD_REDIRECT_URL + "?" + querystring.stringify({name: fields.name}));
}));

//Special endpoints for android
app.post('/api/accuracy', formCallback(function(request, response, fields, files) {
    console.log("hi?");
    var stage = stages[fields.stageId];
    if(stage) stage.broadcast("abbey-node/player/lyrics", fields.lyrics);
}));

//socket.io endpoint
io.sockets.on("connection", function(socket) {
    socket.on("abbey-node/player/ready", socketCallback(socket, playerReady));
    socket.on("abbey-node/player/done", socketCallback(socket, playerDone));
    socket.on("abbey-node/player/oops", socketCallback(socket, playerOopsied));
});

//callbacks
function playerReady(socket, stage, player) {
    player.setReady(socket);
    
    if(stage.isReady()) {
        stage.broadcast("abbey-node/stage/ready", _.map(stage.players, function(player) {
            return {
                playerId: player.id,
                name: player.name,
                instrument: player.instrument
            }
        }));
    }
}

function playerDone(socket, stage, player) {
    player.done = true;
    
    if(stage.isDone()) {
        console.log("Killing stage:", stage.id);
        delete stages[stage.id];
    }
}

function playerOopsied(socket, stage, player) {
    stage.broadcast("abbey-node/player/oops", player.id);
}

//helper functions
function socketCallback(socket, callback) {
    return function(message) {
        var stage = stages[message.stageId];
        if(!stage) {
            console.error("No stage found!");
            return;
        }
        
        var player = stage.players[message.playerId];
        if(!player) {
            console.error("No player found!");
            return;
        }
        
        callback(socket, stage, player);
    }
}

function formCallback(callback) {
    return function(request, response, next) {
        request.form.complete(function(error, fields, files) {
            if(error) {
                next(error);
            } else {
                callback(request, response, fields, files);
            }
        });
    }
}

//creators
function addPlayer(name, special) {
    if(special && !curStage.hasSpecialSlots()) {
        return false;
    }
    
    var player = curStage.addPlayer(name, special);
    
    var response = {
        playerId: player.id,
        stageId: curStage.id,
        instrument: player.instrument,
        song: curStage.song
    };
    
    if(!curStage.hasNormalSlots()) createStage();
    
    return response;
}

function createStage() {
    curStage = new model.Stage();
    stages[curStage.id] = curStage;
}

var stages = {};
var curStage = null;
createStage();
app.listen(process.env.PORT || 8080);
