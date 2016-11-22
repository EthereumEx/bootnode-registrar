var appRouter = function(app) {
    
    app.get("/", function(req, res) {
        res.send(app.bootNodes);
    });

    app.get("/enodes", function(req, res) {
	// enode://{id}@{ip}:{port}
        var enodes = "";
        
        for (var enode in app.bootNodes)
        {
            if (enodes.length > 0) 
            {
               enodes += ",";
            }
            
            enodes += "enode://" + enode + "@" + app.bootNodes[enode] + ":30303";
        }

        return res.send(enodes);
    });

    app.post("/", function(req, res) {
        if(!req.body.enode || !req.body.ip) {
            return res.send({"status": "error", "message": "missing a parameter"});
        } else {
            if (typeof app.bootNodes === "undefined")
	    {
                app.bootNodes =  { };
            }

            app.bootNodes[req.body.enode] = req.body.ip;
            return res.send(app.bootNodes);
        }
    });
}
 
module.exports = appRouter;
