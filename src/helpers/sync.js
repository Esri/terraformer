// super lightweight async to sync handling

function Sync () {
	this._steps = [ ];
  this._arguments = [ ];
  this._current = 0;
  this._error = null;
}

Sync.prototype.next = function () {
  var args = Array.prototype.slice.call(arguments);
  this._steps.push(args.shift());
  this._arguments[this._steps.length - 1] = args;

  return this;
};

Sync.prototype.error = function (error) {
  this._error = error;

  return this;
};

Sync.prototype.done = function (err) {
  this._current++;
  var args = Array.prototype.slice.call(arguments);

  // if there is an error, we are done
  if (err) {
    if (this._error) {
      this._error.apply(this, args);
    }
  } else {
    if (this._steps.length) {
      var next = this._steps.shift();
      var a = this._arguments[this._current];
      next.apply(this, this._arguments[this._current]);
    } else {
      if (this._callback) {
        this._callback();
      }
    }
  }
};

Sync.prototype.start = function (callback) {
  this._callback = callback;

  var start = this._steps.shift();

  if (start) {
    var args = this._arguments[0];
    start.apply(this, args);
  } else {
    if (this._callback) {
      this._callback();
    }
  }
};

