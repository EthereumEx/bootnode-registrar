var Web3 = require('web3');
var net = require('net');
var fs = require('fs');
var request = require('request');
var async = require('async');

function web3Client() {
}

web3Client.prototype.Refresh = function () {

    var client = net.Socket();
    var web3 = new Web3(new Web3.providers.IpcProvider("/home/geth/.geth/geth.ipc", client));

    web3._extend({
        property: 'admin',
        properties:
        [
            new web3._extend.Property({
                name: 'nodeInfo',
                getter: 'admin_nodeInfo'
            }),
        ]
    });

    this.admin = web3.admin;
}

function updateEnode(data, callback) {
    request.post(
        process.env.BOOTNODE_URL,
        {  json : data },
        function (error, response, body) {
            var e = error || response.statusCode != 200;
            callback(e, response);
        }
    )
};

function enodeUpdater(web3Client)
{
    this.web3 = web3Client;
}

function runLoop(obj, timeout)
{
    setTimeout(function () {
        obj.Run(obj);
    }, timeout);
}

enodeUpdater.prototype.Run = function (obj) {
    var web3 = obj.web3;
    web3.Refresh();
    web3.admin.getNodeInfo(function (error, result) {
        var timeout = 1000 * 10;
        if (error) {
            console.log(error);
            runLoop(obj, 500);
        }
        else {
            var data = {
                enode: result.id,
                port: result.ports.listener,
                ip: process.env.HOST_IP
            }
            updateEnode(data, function(err, result){
                if (err)
                {
                    runLoop(obj, 1000 * 5);
                }
                else
                {
                    console.log(data);
                    runLoop(obj, 1000 * 10);
                }
            });
        }
    });
};


if (process.env.BOOTNODE_URL)
{
    var client = new web3Client();
    var enode = new enodeUpdater(client);
    enode.Run(enode);
}
else
{
    console.log("No BOOTNODE_URL provided");
}