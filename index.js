const http = require('http');
const fs = require("fs");
const path = require("path");
const routing = require("./routing").routing();
const tableTask = require("./task-table").tableTask;
const port = 3000;
const currentPath = path.resolve(__dirname);
const ObjectID = require('mongodb').ObjectID;

routing.path = currentPath;

routing.register("/", function (req, res) {
    var file = `${currentPath}/views/index.html`;
    var html = fs.readFileSync(file, "utf8");
    res.end(html);
});

routing.register("/task", function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Transfer-Encoding', 'chunked');

    if(req.method === "GET") {
        tableTask.getAll().then(function (data) {
            if(!Array.isArray(data.data)) {
                data.data = [data.data];
            }

            res.end(JSON.stringify(data));
        }).catch(function (err) {
            res.end(JSON.stringify({error: err.message, errorCode: 500, data: {}}));
        });
    }
    else if (req.method === "POST") {
        let body = JSON.parse(req.body);
        tableTask.add(body).then(function (data) {
            res.end(JSON.stringify(data));
        }).catch(function (err) {
            res.end(JSON.stringify({error: err.message, errorCode: 500, data: {}}));
        });
    }
    else if (req.method === "DELETE") {
        let body = JSON.parse(req.body);
        if(body._id !== undefined) {
            body._id = new ObjectID(body._id);
        }

        tableTask.remove(body).then(function (data) {
            res.end(JSON.stringify(data));
        }).catch(function (err) {
            res.end(JSON.stringify({error: err.message, errorCode: 500, data: {}}));
        });
    }
    else {
        res.end(JSON.stringify({error: "Method not allowed", code: 500, data: {}}));
    }
});

const requestHandler = (request, response) => {
    let body = [];
    request.on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        request.body = Buffer.concat(body).toString();

        if(request.url != "/favicon.ico") {
            var staticJS = request.url.substring(0, 3);
            var staticCSS = request.url.substring(0, 4);
    
            if(staticJS == "/js") {
                routing.handler("static")(request, response);
            } 
            else if (staticCSS == "/css") {
                routing.handler("static")(request, response);
            }
            else {
                routing.handler(request.url)(request, response);
            }
        }
        else {
            response.end('404 Page not found');
        }
    });
}

const server = http.createServer(requestHandler);

server.listen(port, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log(`listening on ${port}`);
})