// super lightweight async to sync handling

function Sync () {
	this._steps = [ ];
  this._current = 0;
  this._error = null;
}

Sync.prototype.next = function (step) {
  this._steps.push(step);

  return this;
};

Sync.prototype.error = function (error) {
  this._error = error;

  return this;
};

Sync.prototype.done = function (err) {
  var args = Array.prototype.slice.call(arguments);

  // if there is an error, we are done
  if (err) {
    if (this._error) {
      this._error.apply(this, args);
    }
  } else {
    if (this._steps.length) {
      var next = this._steps.shift();
      next.apply(this, this.internalCallback);
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
    start.apply(this, this._internalCallback);
  } else {
    if (this._callback) {
      this._callback();
    }
  }
};

