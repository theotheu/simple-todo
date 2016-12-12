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

var todoItems = [];


io.sockets.on("connection", function (socket) {

    // Receives a newTodoItem and adds it to the todoItemsList
    socket.on("submitNewTodoItemMessage", function (toDoItem) {
        console.log('submitNewTodoItemMessage', toDoItem);
        todoItems.push(toDoItem);
        io.sockets.emit("listOfAllTodoItemsMessage", todoItems);
    });

    // Receives a newTodoItem and adds it to the todoItemsList
    socket.on("submitStatusUpdateTodoItemMessage", function (toDoItemId) {
            var toDoItemIdElements = toDoItemId.split('_');
            var nextStatus = toDoItemIdElements[0];
            var id = toDoItemIdElements[1];
            for (var i = 0; i < todoItems.length; i++) {
                var item = todoItems[i];
                console.log('>>>>>', item, id);
                if (item.id == id) {
                    if (nextStatus === 'p') {
                        item.status--;
                    } else {
                        item.status++;
                    }
                }

                if (item.status < 0) {
                    item.status = 0;
                }
            }
            io.sockets.emit("listOfAllTodoItemsMessage", todoItems);
        }
    );

});
