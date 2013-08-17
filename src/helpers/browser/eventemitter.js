// super light weight EventEmitter implementation

function EventEmitter() {
  this._events = { };
  this._once   = { };
  // default to 10 max liseners
  this._maxListeners = 10;

  this._add = function (event, listener, once) {
    var entry = { listener: listener };
    if (once) {
      entry.once = true;
    }

    if (this._events[event]) {
      this._events[event].push(entry);
    } else {
      this._events[event] = [ entry ];
    }

    if (this._maxListeners && this._events[event].count > this._maxListeners && console && console.warn) {
      console.warn("EventEmitter Error: Maximum number of listeners");
    }

    return this;
  };

  this.on = function (event, listener) {
    return this._add(event, listener);
  };

  this.addListener = this.on;

  this.once = function (event, listener) {
    return this._add(event, listener, true);
  };

  this.removeListener = function (event, listener) {
    if (!this._events[event]) {
      return this;
    }

    for(var i = this._events.length-1; i--;) {
      if (this._events[i].listener === callback) {
        this._events.splice(i, 1);
      }
    }

    return this;
  };

  this.removeAllListeners = function (event) {
    this._events[event] = undefined;

    return this;
  };

  this.setMaxListeners = function (count) {
    this._maxListeners = count;

    return this;
  };

  this.emit = function () {
    var args = Array.prototype.slice.apply(arguments);
    var remove = [ ], i;

    if (args.length) {
      var event = args.shift();

      if (this._events[event]) {
        for (i = this._events[event].length; i--;) {
          this._events[event][i].listener.apply(null, args);
          if (this._events[event][i].once) {
            remove.push(listener);
          }
        }
      }

      for (i = remove.length; i--;) {
        this.removeListener(event, remove[i]);
      }
    }

    return this;
  };
}
