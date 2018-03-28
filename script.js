const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const socket = io("localhost");

let colorSelection = 0xf;
let ega = ["#000000", "#0000aa", "#00aa00", "#00aaaa", "#aa0000", "#aa00aa", "#aa5500", "#aaaaaa", "#555555", "#5555ff", "#55ff55", "#55ffff", "#ff5555", "#ff55ff", "#ffff55", "#ffffff"];
let pallet = [];
let drawing = [];


class Bit {
    constructor(x, y, color, index) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.colorBit = false;// boolean
        this.index = index;

        addEventListener('mousedown', (e) => {
            let box = canvas.getBoundingClientRect();
            let mouseX = e.clientX - box.left;
            let mouseY = e.clientY - box.top;
            if (mouseX > this.x && mouseX < this.x + 100 && mouseY > this.y && mouseY < this.y + 100) {
                if (this.colorBit) {
                    colorSelection = this.color;
                } else {
                    this.color = colorSelection;
                    this.draw(context);
                    draw(this.index);
                }
            }
        })
    }

    draw(context) {
        context.beginPath();
        context.fillStyle = ega[this.color];
        context.rect(this.x, this.y, 100, 100);
        context.stroke();
        context.fill();
        context.closePath();
    }
}

function init() {

    // create pallet
    for (let i = 0; i < 0x10; i++) {
        let numOnRow = 2;
        let bitWidth = 100;
        let x = 800 + (i % numOnRow) * bitWidth;
        let y = Math.floor(i / numOnRow) * bitWidth;
        let bit = new Bit(x, y, i);
        bit.colorBit = true;
        bit.draw(context);
        pallet.push(bit);
    }
    /*
    for (i = 0; i < 64; i++) {
        let numOnRow = 8;
        let bitWidth = 100;
        let x = (i % numOnRow) * bitWidth;
        let y = Math.floor(i / numOnRow) * bitWidth;
        let bit = new Bit(x, y, 0xf);
        bit.draw(context);
        drawing[i] = bit;
    }
    */
}

// receive drawing
socket.on('drawing', function(d) {
    for(let i = 0; i < d.length; i++) {
        drawing.push(new Bit(d.x,d.y,d.color,i));
        drawing[i].draw(context);
    }
});

socket.on('block', function(d) {
    drawing[d.index].color = d.color;
    drawing[d.index].draw(context);
});

function draw(index) {
    socket.emit('draw', {index, color:colorSelection});
}

init();
