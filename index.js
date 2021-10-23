let fs = require("fs");
let express = require('express');
let socket = require('socket.io');
const { log } = require("console");


let application = express();
let server = application.listen(5000, function() {
    console.log("Your Server Is Raning At http://localhost:5000");
});


application.use(express.static('public_html'));
var sio = socket(server);


sio.on('connection', function(visitor) {
    visitor.on("message", function(data) {
        sio.sockets.emit("New_Message", data);
        let otherData = data;
        fs.readFile("public_html/js/fakeData.json", "utf-8", function(err, datsa) {
            // insert.push(data);
            let veryData = [];
            let ss = JSON.stringify(otherData);
            for (let i = 0; i < JSON.parse(datsa).length; i++) {
                veryData.push(JSON.parse(datsa)[i])

            }
            veryData.push(JSON.parse(ss));
            console.log(veryData);

            fs.writeFile("public_html/js/fakeData.json", JSON.stringify(veryData), function(err) {
                console.log(err)
            });

        })


    })
    visitor.on("broadcast", function(data) {
        visitor.broadcast.emit("New_broadcast", data)
    })
});