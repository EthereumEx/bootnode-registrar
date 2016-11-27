var moment = require('moment');
var appRouter = function(app) {
    
    function getBootNodes()
    {
        var expired = moment.utc().toJSON();
        for (var enode in app.bootNodes)
        {
            if (app.bootNodes[enode].expires <= expired)
            {
                delete app.bootNodes[enode];
            }
        }

        return app.bootNodes;
    }

    app.get("/", function(req, res) {
        res.send(getBootNodes());
    });

    app.get("/enodes", function(req, res) {
        var enodes = "";
        var network = req.query.network;
        for (var enode in getBootNodes())
        {
            var n = app.bootNodes[enode];
            var inNetwork = network == n.network;

            if (inNetwork || !n.miner)
            {
                var ip = n.publicIp;

                if (inNetwork)
                {
                    ip = n.ip;
                }

                if (enodes.length > 0) 
                {
                    enodes += ",";
                }
                
                enodes += "enode://" + enode + "@" + ip + ":" + n.port;
            }
        }

        return res.send(enodes);
    });

    app.post("/", function(req, res) {
        if(!req.body.enode || !req.body.ip || !req.body.port || !req.body.network) 
        {
            return res.send({"status": "error", "message": "missing a parameter"});
        }
        else 
        {
            if (typeof app.bootNodes === "undefined")
            {
                app.bootNodes =  { };
            }
            
            app.bootNodes[req.body.enode] = {
                "network"     : req.body.network,
                "ip"          : req.body.ip,
                "publicIp"    : req.body.publicIp,
                "port"        : req.body.port,
                "miner"       : req.body.miner,
                "expires"     : moment.utc().add(3, "minutes").toJSON()
            }             

            return res.send(app.bootNodes);
        }
    });
}
 
module.exports = appRouter;
