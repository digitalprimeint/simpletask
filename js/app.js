var tasks = [];

var card = `<div class="card card-light">
                        <label>Title</label>
                        <input id="title" value="[json:title]" type="text" placeholder="Add a task name" readonly />
                        <label>Description</label>
                        <textarea id="description" rows="5" placeholder="Add a task description" readonly>[json:description]</textarea>
                        <label>Priority: <b>[json:priority]</b></label>
                        <input class="btn btn-dark mt-5" type="button" value="DELETE" onclick="deleteTask(this, '[json:_id]')">
                    </div>`;

function get(url, data, callback) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        try {
            if (this.readyState == 4 && this.status == 200) {
                callback(JSON.parse(this.responseText));
            }
        }
        catch (err) {
            callback(null, err);
        }
    };

    xhttp.open("GET", url, true);
    xhttp.send(data);
}

function postJSON(url, data, callback) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        try {
            if (this.readyState == 4 && this.status == 200) {
                callback(JSON.parse(this.responseText));
            }
        }
        catch (err) {
            callback(null, err);
        }
    };

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(data));
}

function deleteJSON(url, data, callback) {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        try {
            if (this.readyState == 4 && this.status == 200) {
                callback(JSON.parse(this.responseText));
            }
        }
        catch (err) {
            callback(null, err);
        }
    };

    xhttp.open("DELETE", url, true);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(JSON.stringify(data));
}

function addTask() {
    var task = new TaskHandler();

    if (task.valid()) {
        var template = new JsonReader();
        var model = task.model();

        postJSON("/task", model, function (data, err) {
            if (err) {
                alert(err.message)
            }
            else {
                console.log(data);
                if (data.success) {
                    tasks.push(model);
                    var cardHtml = template.parse(card, model);
                    document.getElementById("container").innerHTML = document.getElementById("container").innerHTML + cardHtml;
                    task.reset();
                }
                else {
                    alert(data.error);
                }
            }
        });
    }
}

function deleteTask(ele, id) {
    var model = {
        "_id": id.trim()
    }

    deleteJSON("/task", model, function (response, err) {
        if(err) {
            alert(err.message);
        }
        else {
            if(response.success) {
                document.getElementById("container").removeChild(ele.parentNode);
            }
            else {
                alert(response.error);
            }
        }
    });
}

function filterPriority(priority) {
    document.getElementById("container").innerHTML = "";

    var filtered = tasks.filter(item => {
        if (item.priority === priority) {
            return true;
        }
        else {
            return false;
        }
    });

    if (filtered.length > 0) {
        renderCards(filtered);
    }
    else {
        if (filtered.length == 0 && priority === "All") {
            renderCards(tasks);
        }
    }
}

function search() {
    if (document.getElementById("search").value.length > 0) {
        if (tasks.length > 0) {
            var filtered = tasks.filter(item => {
                var searchText = document.getElementById("search").value;
                if (item.title.includes(searchText) ||
                    item.description.includes(searchText)) {
                    return true;
                }
                else {
                    return false;
                }
            });

            document.getElementById("container").innerHTML = "";

            if (filtered.length > 0) {
                renderCards(filtered);
            }
        }
    }
    else {
        if (document.getElementById("search").value.length == 0) {
            document.getElementById("container").innerHTML = "";
            renderCards(tasks);
        }
    }
}

function renderCards(items) {
    items.forEach(model => {
        var template = new JsonReader();
        var cardHtml = template.parse(card, model);
        document.getElementById("container").innerHTML = document.getElementById("container").innerHTML + cardHtml;
    });
}

get("/task", "", function (response, err) {
    if (err) {
        alert(err.message);
    }
    else {
        if (response.success) {
            if (response.data.length > 0) {
                tasks = response.data;
                renderCards(tasks);
            }
        }
    }
})