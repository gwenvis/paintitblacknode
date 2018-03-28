const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

let drawing = [];

function createDrawing() {
    for(let i = 0; i < 64; i++) {
        let numOnRow = 8;
        let bitWidth = 100;
        let x = (i % numOnRow) * bitWidth;
        let y = Math.floor(i / numOnRow) * bitWidth;

        drawing.push({x, y, color:1});
    }
}

createDrawing();

app.use(express.static('./'));

io.on('connection', function(socket) {

    socket.emit('drawing', drawing);

    socket.on('draw', function(obj) {
        drawing[obj.index].color = obj.color;
        io.emit('block', {index:obj.index,color:obj.color});
    });
});

http.listen(port, function() {
    console.log('listening on port 3000');
});