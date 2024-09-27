"use strict";
const canvas = document.getElementById("canvas");
const board = document.querySelector('main');
const ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var currentColor = '#FF0000';
var currentlineW = 5;
let currentFill = false;
let currentMode = '';
let selectedElement = null;
let prevX = -1;
let prevY = -1;
let Mousedown = false;
let shapes = [];
class drawable {
    constructor(color, lineWidth, drawMode) {
        this.color = color;
        this.lineWidth = lineWidth;
        this.drawMode = drawMode;
        this.lastEdited = Date.now();
    }
    getLastEdited() {
        return this.lastEdited;
    }
}
class Shape extends drawable {
    constructor(startX, startY, endX, endY, color, lineWidth, fill, shape, drawMode) {
        super(color, lineWidth, drawMode);
        this.startX = startX;
        this.startY = startY;
        this.endX = endX;
        this.endY = endY;
        this.color = color;
        this.lineWidth = lineWidth;
        this.fill = fill;
        this.shape = shape;
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;
        switch (this.shape) {
            case 'rec':
                ctx.rect(this.startX, this.startY, this.endX - this.startX, this.endY - this.startY);
                break;
            case 'cir':
                ctx.arc(this.startX, this.startY, Math.sqrt((this.endX - this.startX) ** 2 + (this.endY - this.startY) ** 2), 0, Math.PI * 2);
                break;
            case 'lin':
                ctx.moveTo(this.startX, this.startY);
                ctx.lineTo(this.endX, this.endY);
                ctx.stroke();
                return;
        }
        if (this.fill) {
            ctx.fill();
        }
        else {
            ctx.stroke();
        }
    }
    isInside(x, y) {
        switch (this.shape) {
            case 'rec':
                return (x > this.startX && x < this.endX && y > this.startY && y < this.endY) || (x < this.startX && x > this.endX && y < this.startY && y > this.endY);
            case 'cir':
                return Math.sqrt((x - this.startX) ** 2 + (y - this.startY) ** 2) < Math.sqrt((this.endX - this.startX) ** 2 + (this.endY - this.startY) ** 2);
            case 'lin':
                const distance = Math.abs((this.endY - this.startY) * x - (this.endX - this.startX) * y + this.endX * this.startY - this.endY * this.startX) / Math.sqrt((this.endY - this.startY) ** 2 + (this.endX - this.startX) ** 2);
                return distance <= this.lineWidth / 2;
        }
        return false;
    }
}
class Brush extends drawable {
    constructor(color, lineWidth, drawMode) {
        super(color, lineWidth, drawMode);
        this.lines = [];
    }
    addLine(x1, y1, x2, y2, eraser) {
        if (eraser) {
            console.log("erase");
            this.lines.push(new Shape(x1, y1, x2, y2, 'rgba(255, 255, 255, 1)', this.lineWidth, false, 'lin', false));
            this.lastEdited = Date.now();
        }
        else {
            console.log("addLine from " + x1 + " " + y1 + " to " + x2 + " " + y2);
            this.lines.push(new Shape(x1, y1, x2, y2, this.color, this.lineWidth, false, 'lin', false));
            this.lines.push(new Shape(x2, y2, x2 + this.lineWidth / 4, y2 + this.lineWidth / 4, this.color, this.lineWidth / 2, true, 'cir', false));
        }
        this.lastEdited = Date.now();
    }
    draw(ctx) {
        for (let i = 0; i < this.lines.length; i++) {
            this.lines[i].draw(ctx);
        }
    }
    isInside(x, y) {
        return false;
    }
}
window.addEventListener("mousedown", (e) => {
    Mousedown = true;
    selectedElement = null;
    prevX = e.clientX;
    prevY = e.clientY;
    if (currentMode == 'bru' || currentMode == 'era') {
        shapes.push(new Brush(currentColor, currentlineW, true));
    }
    else if (currentMode == 'lin' || currentMode == 'rec' || currentMode == 'cir') {
        shapes.push(new Shape(prevX, prevY, prevX, prevY, currentColor, currentlineW, currentFill, currentMode, false));
    }
});
window.addEventListener("mouseup", (e) => {
    Mousedown = false;
    const shape = shapes[shapes.length - 1];
    if (shape) {
        shape.drawMode = false;
    }
    drawShapes();
    prevX = -1;
    prevY = -1;
});
window.addEventListener("mousemove", (e) => {
    if (Mousedown) {
        if (currentMode == 'bru' && shapes[shapes.length - 1] instanceof Brush) {
            shapes[shapes.length - 1].addLine(prevX, prevY, e.clientX, e.clientY, false);
            prevX = e.clientX;
            prevY = e.clientY;
        }
        else if (currentMode == 'era' && shapes[shapes.length - 1] instanceof Brush) {
            shapes[shapes.length - 1].addLine(prevX, prevY, e.clientX, e.clientY, true);
            prevX = e.clientX;
            prevY = e.clientY;
        }
        else if ((currentMode == 'lin' || currentMode == 'rec' || currentMode == 'cir') && shapes[shapes.length - 1] instanceof Shape) {
            const shape = shapes.pop();
            if ((shape === null || shape === void 0 ? void 0 : shape.drawMode) == true) {
                shape.endX = e.clientX;
                shape.endY = e.clientY;
                shapes.push(shape);
            }
            else {
                shapes.push(new Shape(prevX, prevY, e.clientX, e.clientY, currentColor, currentlineW, currentFill, currentMode, true));
            }
        }
        drawShapes();
    }
});
window.addEventListener("keydown", (e) => {
    if (e.key == 'b') {
        setMode('bru');
    }
    else if (e.key == 'l') {
        setMode('lin');
    }
    else if (e.key == 'e') {
        setMode('era');
    }
    else if (e.key == 'r') {
        setMode('rec');
    }
    else if (e.key == 'c') {
        setMode('cir');
    }
    else if (e.key == 'f') {
        currentFill = !currentFill;
    }
    else if (e.key == 'ArrowUp') {
        currentlineW += 1;
    }
    else if (e.key == 'ArrowDown') {
        currentlineW -= 1;
    }
});
function drawShapes() {
    console.info("drawShapes" + shapes.length);
    if (ctx) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        for (let i = 0; i < shapes.length; i++) {
            shapes[i].draw(ctx);
        }
    }
}
function setMode(mode) {
    currentMode = mode;
}
const saveButton = document.getElementById("saveButton");
saveButton.addEventListener("click", (e) => {
    console.log("saveButton clicked");
    var link = document.createElement('a');
    link.download = 'filename.png';
    link.href = document.getElementById('canvas').toDataURL();
    link.click();
});
//# sourceMappingURL=index.js.map