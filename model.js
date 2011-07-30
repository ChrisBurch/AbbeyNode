var util = require("./util");
var _ = require("./underscore")._;
var songs = require("./songs");

var INSTRUMENTS = ["guitar", "bass_guitar", "drums"];

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
    addPlayer: function(name, special) {
        var instrument = special ? "special" : this.openInstruments.pop();
        
        var player = new Player(name, instrument);
        this.players[player.id] = player;
        return player;
    },
    
    hasNormalSlots: function() {
        return this.openInstruments.length > 0;
    },
    
    hasSpecialSlots: function() {
        return !_.any(this.players, function(v) { return v.instrument == "special"; });
    },
    
    isDone: function() {
        return !this.hasNormalSlots() && _.all(this.players, function(v, k) { return v.done; });
    },
    
    isReady: function() {
        return !this.hasNormalSlots() && _.all(this.players, function(v, k) { return v.ready; });
    },
    
    broadcast: function(name, content) {
        _.each(this.players, function(player) {
            player.socket.emit(name, content);
        });
    }
};

exports.Stage = Stage;