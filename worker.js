importScripts('workforce.js');

self.on('ping', function () {
  self.emit('pong');
});

self.on('foo:bar', function (e, obj) {
  obj.foo = 'baz';
  self.emit('foo:baz', obj);
});

self.emit('wild:1');
self.emit('wild:2');
self.emit('wild:3');