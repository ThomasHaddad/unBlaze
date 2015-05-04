/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Group = require('./group.model');

exports.register = function(socket) {
  Group.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Group.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
};

function onSave(socket, doc, cb) {

  for (var i= 0; i<doc.users.length; i++){

    var user_id = doc.users[i];
    var tag = 'group_'+user_id + ':save';

    socket.emit(tag, doc);
  }

}

function onRemove(socket, doc, cb) {
  socket.emit('group:remove', doc);
}
