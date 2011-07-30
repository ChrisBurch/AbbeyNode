var util = require("./util");
var _ = require("./underscore")._;
var songs = require("./songs");

var INSTRUMENTS = ["guitar", "bass_guitar", "drums", "cowbell"];

var lastPlayerId = 0;
var lastStageId = 0;

function Player(name, instrument) {
    this.id = lastPlayerId++;
    this.name = name;
    this.instrument = instrument;
    this.socket = null;
    this.ready = false;
    this.done = false;
}

Player.prototype = {
    setReady: function(socket) {
        this.ready = true;
        this.socket = socket;
    }
};

function Stage() {
    this.id = lastStageId++;
    this.song = util.randomItem(songs.songs);
    this.openInstruments = INSTRUMENTS.slice(0);
    this.players = {};
}

Stage.prototype = {
    addPlayer: function(name) {
        var player = new Player(name, this.openInstruments.pop());
        this.players[player.id] = player;
        return player;
    },
    
    isFilled: function() {
        return this.openInstruments.length == 0;
    },
    
    isDone: function() {
        return this.isFilled() && _.all(this.players, function(v, k) { return v.done; });
    },
    
    isReady: function() {
        return this.isFilled() && _.all(this.players, function(v, k) { return v.ready; });
    },
    
    broadcast: function(name, content) {
        _.each(this.players, function(player, playerId) {
            player.socket.emit(name, content);
        });
    }
};

exports.Stage = Stage;