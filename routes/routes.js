var appRouter = function(app) {
    
    app.get("/", function(req, res) {
        res.send(app.bootNodes);
    });

    app.get("/enodes", function(req, res) {
        var enodes = "";
        
        for (var ip in app.bootNodes)
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
                "enode": req.body.enode,
                "port" : req.body.port,
                "updated" : new Date().toJSON()
            } 
            
            return res.send(app.bootNodes);
        }
    });
}
 
module.exports = appRouter;
