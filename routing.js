const fs = require("fs");

function RoutingHandler () {
    var self = this;
    this.routes = [];
    this.path = "";

    this.init = function () {
        this.routes.push({
            "path": "static",
            "handler": function (req, res) {
                var filePath = self.path + req.url;

                fs.readFile(filePath, function (err, data) {
                    if (err) {
                        res.writeHead(404);
                        res.end(JSON.stringify(err));
                        return;
                    }

                    if(filePath.split(".")[1] === "js") {
                        res.setHeader('Content-Type', 'application/javascript');
                    }

                    if(filePath.split(".")[1] === "css") {
                        res.setHeader('Content-Type', 'text/css');
                    }
                    
                    res.writeHead(200);
                    res.end(data);
                });
            }
        });
    }

    this.register = function (path, callback) {
        var obj = this.includes(path);
        if(!obj.exists) {
            this.routes.push({
                "path": path,
                "handler": callback
            });
        }
    }

    this.handler = function (path) {
        var obj = this.includes(path);
        return obj.handler;
    }

    this.includes = function (path) {
        var obj = {
            exists: false,
            handler: function () {}
        }

        var route = this.routes.filter(data => data.path === path);
        if(route.length == 0) {
            obj.handler = function (request, response) {
                response.end('404 Page not found')
            }
        }
        else {
            obj.handler = route[0].handler;
        }

        return obj;
    }

    this.init();
}

exports.routing = function () {
    return new RoutingHandler();
}