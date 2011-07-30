var express = require("express");
var form = require("connect-form");

var _ = require("./underscore")._;
var model = require("./model");
var songs = require("./songs");

var app = express.createServer();
var io = require("socket.io").listen(app);

var SONG_UPLOAD_REDIRECT_URL = '/musicmaker/index.html'

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
    response.send(addPlayer(fields.name));
}));

app.post('/api/sheet', formCallback(function(request, response, fields, files) {
    songs.saveSheet(fields.name, fields.sheet);
}));

app.post('/api/song', formCallback(function(request, response, fields, files) {
    songs.saveSong(fields.name, files.song.path);
    response.redirect(SONG_UPLOAD_REDIRECT_URL);
}));

//Special endpoints for android
app.get('/api/oops', androidCallback(androidPlayerOopsied));
app.get('/api/accuracy', androidCallback(androidPlayerAccuracy));

//socket.io endpoint
io.sockets.on("connection", function(socket) {
    socket.on("abbey-node/player/ready", socketCallback(socket, playerReady));
    socket.on("abbey-node/player/done", socketCallback(socket, playerDone));
    socket.on("abbey-node/player/oops", socketCallback(socket, playerOopsied));
});

function androidCallback(callback) {
    return function(request, response) {
        var stage = stages[request.get('stageId')];
        if(!stage) {
            console.error("No stage found!");
            return;
        }
        
        var player = stage.players[request.get('playerId')];
        if(!player) {
            console.error("No player found!");
            return;
        }
        
        callback(stage, player);
    }
}

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

function createStage() {
    curStage = new model.Stage();
    stages[curStage.id] = curStage;
}

function addPlayer(name) {
    var player = curStage.addPlayer(name);
    
    var response = {
        playerId: player.id,
        stageId: curStage.id,
        instrument: player.instrument,
        song: curStage.song
    };
    
    if(curStage.isFilled()) createStage();
    return response;
}

function playerReady(socket, stage, player) {
    player.setReady(socket);
    
    if(stage.isReady()) {
        stage.broadcast("abbey-node/stage/ready", null);
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

function androidPlayerOopsied(stage, player) {
    stage.broadcast("abbey-node/player/oops", player.id);
}

function androidPlayerAccuracy(stage, player) {
    //TODO
}

var stages = {};
var curStage = null;
createStage();
app.listen(process.env.PORT || 8080);