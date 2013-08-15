var assert = require("assert"),
    nomnom = require("../nomnom");

var opts = {
  room: {
    string: '-r ROOM, --room=ROOM',
    help: 'Room to connect to; can either be the room name or the room ID.',
    callback: function(number) {
      if(number)
        return "weee";
    },
    required: true
  },
  verbose: {
    string: '-v, --verbose'
  },
  version: {
    string: '--version',
    callback: function() {
      return "1.2.4";
    }
  }
}

nomnom.opts(opts).parseArgs(["--version"])