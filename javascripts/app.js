/**
 * Created by theotheu on 26-12-16.
 */
/* statusses
 0: todo
 1: progress
 2: done
 */

var db = new PouchDB('todos');

// Replace with remote instance, this just replicates to another local instance.
//var remoteCouch = 'todos_remote';
var remoteCouch = 'http://theotheu:moeilijkwachtwoord@node158.tezzt.nl:5984/todos';


db.changes({
    since: 'now',
    live: true
}).on('change', showTodos);


// Checks if a new toto item is submitted
document.onkeyup = function (e) {
    if (e.which === 13) {
        var newTodoItem = {};
        newTodoItem._id = (parseFloat(new Date().getTime() + Math.random())).toString();
        newTodoItem.status = 0;
        newTodoItem.action = document.getElementById("newTodoItem").value;
        // TODO
        addTodo(newTodoItem);
        document.getElementById("newTodoItem").value = "";
    }
};


// Initialise a sync with the remote server
function sync() {
    console.log('>>>>> Syncing...');
    document.getElementById("msg").innerHTML = 'Live syncing';
    document.getElementById("msg").className = "success";
    var opts = {live: true};
    db.replicate.to(remoteCouch, opts, syncError);
    db.replicate.from(remoteCouch, opts, syncError);
}

// There was some form or error syncing
function syncError(err) {
    console.log('>>>>> Error', err);
    document.getElementById("msg").innerHTML = JSON.stringify(err, null, 4);
    document.getElementById("msg").className = "failure";
}

// CREATE
function addTodo(todo) {
    console.log('>>>>> CREATE', todo);
    db.put(todo, function callback(err, result) {
        if (!err) {
            console.log('Successfully posted a todo!');
        } else {
            console.log('>>>>>', err);
            document.getElementById("msg").innerHTML = JSON.stringify(err, null, 4);
            document.getElementById("msg").className = "failure";
        }
    });
}

// RETRIEVE
function showTodos() {

    db.allDocs({include_docs: true, descending: true}, function (err, docs) {
        var itemsTodo = [], itemsProgress = [], itemsDone = [];

        for (var i = 0; i < docs.rows.length; i++) {
            var item = docs.rows[i].doc;

            var clickItem = "<li>" + item.action + " <span class='changeStatus' id='p_" + item._id + "'>^</span> <span class='changeStatus' id='n_" + item._id + "'>v</span></li>";
            if (item.status === undefined || item.status === 0) {
                itemsTodo.push(clickItem);
            } else if (item.status === 1) {
                itemsProgress.push(clickItem);
            } else if (item.status === 2) {
                itemsDone.push(clickItem);
            }
            document.getElementById('itemsTodo').innerHTML = itemsTodo.join("");
            document.getElementById('itemsProgress').innerHTML = itemsProgress.join("");
            document.getElementById('itemsDone').innerHTML = itemsDone.join("");
        }

        var nodes = document.getElementsByClassName('changeStatus');
        for (i = 0; i < nodes.length; i++) {
            nodes[i].addEventListener('click', updateItem, false);
            nodes[i].addEventListener('mouseover', function () {
                this.style.cursor = 'pointer';
            });
            nodes[i].addEventListener('mouseout', function () {
                this.style.cursor = 'normal';
            });
        }
    });
}


// UPDATE
function updateItem(e) {
    var parts = e.target.id.split("_");
    var newStatus = parts[0];
    var _id = parts[1];

    // retrieve local document
    db.get(_id).then(function (doc) {
        if (newStatus === 'p') {
            doc.status--;
        } else {
            doc.status++;
        }
        if (doc.status < 0) {
            doc.status = 0;
        }

        db.put(doc, function callback(err, result) {
            if (!err) {
                console.log('Successfully updated a todo!');
            } else {
                console.log('>>>>>', err);
                document.getElementById("msg").innerHTML = JSON.stringify(err, null, 4);
                document.getElementById("msg").className = "failure";
            }
        });
    });

}

showTodos();

if (remoteCouch) {
    sync();
}