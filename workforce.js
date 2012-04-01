/**
 * Workforce - Wildcard/regex supported event interface for web workers
 * 
 * Copyright (c) 2012 Stephen Belanger
 * Licensed under MIT License
 * 
 * Worker and normal context parts can easily be extracted
 * for minification, but both depend on WorkforceEvent.
 */
function WorkforceEvent (name) {
  this.name = name;
}

// Worker context
if (typeof window === 'undefined') {
  var events = []
  self.on = function (action, fn) {
    if (typeof action === 'string') {
      action = new RegExp('^' + action.replace(/\*/g, '[a-z0-9]*') + '$', 'i');
    }
    events.push({ action: action, fn: fn });
  }
  self.emit = function (action) {
    postMessage({
      action: action, args: Array.prototype.slice.call(arguments, 1)
    });
  }
  self.onmessage = function (e) {
    var we = new WorkforceEvent(e.data.action);
    events.filter(function (ev) {
      return ev.action.test(e.data.action);
    }).forEach(function (ev) {
      ev.fn.apply(null, [we].concat(e.data.args));
    });
  }

// Normal contenxt
} else {
  function Workforce (path) {
    var self = this;
    this.events = [];

    // Receive events from worker and emit back
    this._worker = new Worker(path);
    this._worker.onmessage = function (e) {
      var we = new WorkforceEvent(e.data.action);
      self.events.filter(function (ev) {
        return ev.action.test(e.data.action);
      }).forEach(function (ev) {
        ev.fn.apply(null, [we].concat(e.data.args));
      });
    }
  }

  Workforce.prototype.on = function (action, fn) {
    if (typeof action === 'string') {
      action = new RegExp('^' + action.replace(/\*/g, '[a-z0-9]*') + '$', 'i');
    }
    this.events.push({ action: action, fn: fn });
  }

  Workforce.prototype.emit = function (action) {
    var data = {
      action: action, args: Array.prototype.slice.call(arguments, 1)
    };
    try {
      this._worker.postMessage(data);
    } catch (e) {
      console.log('data is', data);
      throw new Error(e);
    }
  }
}