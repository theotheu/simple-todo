var express = require("express"),
    app = express(),
    server = require("http").createServer(app),
    io = require("socket.io").listen(server),
    path = require('path'),
    mongoose = require('mongoose');

// DATABASE: initialising connection
mongoose.connect('mongodb://localhost/simple-todo');

// DATABASE: model
var simpleTodoSchema = mongoose.Schema({
    _id: String,
    action: String,
    status: Number
});
var simpleTodo = mongoose.model('simple-todo', simpleTodoSchema);


server.listen(5000, function () {
    console.log('Listening on port 5000.');
});

app.get("/", function (req, res) {
    res.sendFile(path.resolve(__dirname + "/../client/index.html"));
});
// DATABASE: Retrieve all items
function retrieveToDoItems(io) {
    simpleTodo
        .find({})
        .exec(function (err, docs) {
            console.log('*****', docs)
            io.sockets.emit("listOfAllTodoItemsMessage", docs);
        });
}

function broadcastToDoItems(err, io) {
    if (!err) {
        retrieveToDoItems(io);
    }
}

function socketStuff() {
    io.sockets.on("connection", function (socket) {

        // Receives a newTodoItem and adds it to the todoItemsList
        socket.on("submitNewTodo§ItemMessage", function (toDoItem) {
            console.log('>>>>> submitNewTodoItemMessage', toDoItem);
            if (toDoItem.action !== '') {

                // DATABASE: Create
                var toDoItemForDatabase = new simpleTodo(toDoItem)
                toDoItemForDatabase.save(function (err) {
                    console.log('>>>>>', err);
                    broadcastToDoItems(err, io);
                });
            }
        });

        // Receives a newTodoItem and updates the status
        socket.on("submitStatusUpdateTodoItemMessage", function (toDoItemId) {
                if (toDoItemId.indexOf('-') === -1) {
                    return;
                }
                var toDoItemIdElements = toDoItemId.split('_');
                var nextStatus = toDoItemIdElements[0];
                var id = toDoItemIdElements[1];

                console.log('>>>>> id', toDoItemId);

                for (var i = 0; i < todoItems.length; i++) {
                    var item = todoItems[i];
                    if (item.id == id) {
                        if (nextStatus === 'p') {
                            item.status--;
                        } else {
                            item.status++;
                        }
                        // TODO: update items in the database
                    }

                    // Items can have no lower status than 0 (to do).
                    if (item.status < 0) {
                        item.status = 0;
                    }
                }
                broadcastToDoItems(null, io);
            }
        );

    });
}

socketStuff();