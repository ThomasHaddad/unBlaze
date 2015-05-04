/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Message = require('./message.model');

exports.register = function(socket) {
  Message.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Message.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
};

function onSave(socket, doc, cb) {

  console.log(doc.group);

  var group = doc.group;
  var tag = 'group_'+group+':save';

  socket.emit(tag, doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('message:remove', doc);
}
