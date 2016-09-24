var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var Storage = {
  add: function(name) {
    var item = {name: name, id: this.setId};
    this.items.push(item);
    this.setId += 1;
    return item;
  },
  remove: function(Id) {
    for (var i = 0; i < this.items.length; i++){
      if (this.items[i].id == Id){
        this.items.splice(i, 1);
        return true;
      }
      else {
        return false;
      }
    }
  },
};

var createStorage = function() {
  var storage = Object.create(Storage);
  storage.items = [];
  storage.setId = 1;
  return storage;
}

var storage = createStorage();

storage.add('Broad beans');
storage.add('Tomatoes');
storage.add('Peppers');

var app = express();
app.use(express.static('public'));

app.get('/items', function(request, response) {
    response.json(storage.items);
});

app.post('/items', jsonParser, function(request, response) {
    if (!('name' in request.body)) {
        return response.sendStatus(400);
    }

    var item = storage.add(request.body.name);
    response.status(201).json(item);
});
app.delete('/items/:id', function(request, response) {
    var itemToRemove = storage.remove(request.params.id);
    if (itemToRemove == true){
        response.status(200);
    }
    else {
        response.status(404).json( {
          error: 'whoops, not found'
        });
    }
});
app.put('/items/:id', jsonParser, function(request, response) {
    if (!('name' in request.body)) {
        return response.sendStatus(400);
    }
    storage.remove(request.params.id);
    storage.add(request.body.name);
    response.status(200).json(request.body.name);
});

app.listen(process.env.PORT || 8080, process.env.IP);
console.log("starting server on port 8080")

exports.app = app;
exports.storage = storage;
