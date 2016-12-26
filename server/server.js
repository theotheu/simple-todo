var express = require("express"),
    app = express(),
    server = require("http").createServer(app),
    io = require("socket.io").listen(server);

server.listen(5000, function () {
    console.log('Listening on port 5000.');
});
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

// TODO: populate this list with items from the database
var todoItems = [];


io.sockets.on("connection", function (socket) {

    // Receives a newTodoItem and adds it to the todoItemsList
    socket.on("submitNewTodoItemMessage", function (toDoItem) {
        console.log('>>>>> submitNewTodoItemMessage', toDoItem);
        if (toDoItem.action !== '') {
            todoItems.push(toDoItem);
            // TODO: add items in the database
            io.sockets.emit("listOfAllTodoItemsMessage", todoItems);
        }
    });

    // Receives a newTodoItem and adds it to the todoItemsList
    socket.on("submitStatusUpdateTodoItemMessage", function (toDoItemId) {
            var toDoItemIdElements = toDoItemId.split('_');
            var nextStatus = toDoItemIdElements[0];
            var id = toDoItemIdElements[1];
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
            io.sockets.emit("listOfAllTodoItemsMessage", todoItems);
        }
    );

});
