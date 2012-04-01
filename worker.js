// The workforce lib needs to be imported
importScripts('workforce.js');

// Respond to ping
self.on('ping', function () {
  self.emit('pong');
});

// Modify object and respond
self.on('foo:bar', function (e, obj) {
  obj.foo = 'baz';
  self.emit('foo:baz', obj);
});

// Trigger the wildcard events
self.emit('wild:1');
self.emit('wild:2');
self.emit('wild:3');