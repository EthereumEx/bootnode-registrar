var moment = require('moment');
var appRouter = function(app) {
    
    function getBootNodes()
    {
        var expired = moment.utc().toJSON();
        for (var ip in app.bootNodes)
        {
            if (app.bootNodes[ip].expires <= expired)
            {
                delete app.bootNodes[ip];
            }
        }

        return app.bootNodes;
    }

    app.get("/", function(req, res) {
        res.send(getBootNodes());
    });

    app.get("/enodes", function(req, res) {
        var enodes = "";
        
        for (var ip in getBootNodes())
        {
            if (enodes.length > 0) 
            {
               enodes += ",";
            }
            
            var n = app.bootNodes[ip];
            enodes += "enode://" + n.enode + "@" + ip + ":" + n.port;
        }

        return res.send(enodes);
    });

    app.post("/", function(req, res) {
        if(!req.body.enode || !req.body.ip || !req.body.port) 
        {
            return res.send({"status": "error", "message": "missing a parameter"});
        }
        else 
        {
            if (typeof app.bootNodes === "undefined")
            {
                app.bootNodes =  { };
            }
            
            app.bootNodes[req.body.ip] = {
                "enode" : req.body.enode,
                "port"  : req.body.port,
                "miner" : req.body.miner,
                "expires" : moment.utc().add(3, "minutes").toJSON()
            }             

            return res.send(app.bootNodes);
        }
    });
}
 
module.exports = appRouter;
