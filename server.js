const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);

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

app.get('/', function(req, res) {
    res.sendFile('index.html');
});

io.on('connection', function(socket) {

    socket.emit('drawing', drawing);

    socket.on('draw', function(obj) {
        drawing[obj.index].color = obj.color;
    });
});

http.listen(3000, function() {
    console.log('listening on port 3000');
});