var moment = require('moment');
var os = require('os');
var appRouter = function (app) {

    function getBootNodes() {
        var expired = moment.utc().toJSON();
        for (var enode in app.bootNodes) {
            if (app.bootNodes[enode].expires <= expired) {
                delete app.bootNodes[enode];
            }
        }

        return app.bootNodes;
    }

    function getEnodes(network) {
        var enodes = [];

        for (var enodeId in getBootNodes()) {
            var n = app.bootNodes[enodeId];
            var inNetwork = network == n.network;

            if (inNetwork || !n.miner) {
                var nodeIp = n.publicIp;

                if (inNetwork) {
                    nodeIp = n.ip;
                }

                enodes.push({
                    enode: enodeId,
                    ip: nodeIp,
                    port: n.port
                });
            }
        }

        return enodes;
    }

    function asEnodeString(node)
    {
        return "enode://" + node.enode + "@" + node.ip + ":" + node.port;
    }

    app.get("/", function (req, res) {
        res.json(getBootNodes());
    });

    app.get("/staticenodes", function (req, res) {
        var network = req.query.network;
        var output = [];

        var nodes = getEnodes(network);
        for(var i in nodes)
        {
            output.push(asEnodeString(nodes[i]))
        }
        return res.json(output);
    });

    app.get("/parityenodes", function (req, res) {
        var network = req.query.network;
        var output = "";

        var nodes = getEnodes(network);
        for(var i in nodes)
        {
            output += asEnodeString(nodes[i]) + "\n";
        }
        return res.send(output);
    });

    app.get("/enodes", function (req, res) {
        var enodes = "";
        var network = req.query.network;

        var nodes = getEnodes(network);
        for (var nodeIndex in nodes) {
            var node = nodes[nodeIndex];
            if (enodes.length > 0) {
                enodes += ",";
            }

            enodes += asEnodeString(node);
        }

        return res.send(enodes);
    });

    app.post("/", function (req, res) {
        if (!req.body.enode || !req.body.ip || !req.body.port || !req.body.network) {
            return res.status(400).send({ "status": "error", "message": "missing a parameter" });
        }
        else {
            if (typeof app.bootNodes === "undefined") {
                app.bootNodes = {};
            }

            app.bootNodes[req.body.enode] = {
                "network": req.body.network,
                "ip": req.body.ip,
                "publicIp": req.body.publicIp,
                "port": req.body.port,
                "miner": req.body.miner,
                "expires": moment.utc().add(3, "minutes").toJSON()
            }

            return res.send(app.bootNodes);
        }
    });
}

module.exports = appRouter;
