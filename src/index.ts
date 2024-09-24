//deklaration
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const body = document.querySelector('body') as HTMLBodyElement;
body.style.backgroundColor = "#FFFFFF";

const ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;


var currentColor: string = '#FF0000';
var currentlineW: number = 5;
let currentFill: boolean = false;
let currentMode: string = 'bru';
let selectedElement: drawable | null = null;

let prevX: number = -1;
let prevY: number = -1;
let Mousedown: boolean = false;


let shapes: drawable[] = [];

abstract class drawable {

    public color: string;
    protected lineWidth: number;
    protected lastEdited: number;
    public drawMode: boolean;

    constructor(color: string, lineWidth: number, drawMode: boolean) {
        this.color = color;
        this.lineWidth = lineWidth;
        this.drawMode = drawMode;
        this.lastEdited = Date.now();
    }

    public getLastEdited(): number {
        return this.lastEdited;
    }

    abstract draw(ctx: CanvasRenderingContext2D): void;
    abstract isInside(x: number, y: number): boolean;
}

class Shape extends drawable {

    private startX: number;
    private startY: number;
    public endX: number;
    public endY: number;

    private fill: boolean;
    private shape: string;

    public constructor(startX: number, startY: number, endX: number, endY: number, color: string, lineWidth: number, fill: boolean, shape: string, drawMode: boolean) {
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


    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath()
        ctx.lineWidth = this.lineWidth;
        ctx.strokeStyle = this.color;
        ctx.fillStyle = this.color;

        switch (this.shape) {
            case 'rec':
                ctx.rect(this.startX, this.startY, this.endX - this.startX, this.endY - this.startY)
                break;
            case 'cir':
                ctx.arc(this.startX, this.startY, Math.sqrt((this.endX - this.startX) ** 2 + (this.endY - this.startY) ** 2), 0, Math.PI * 2)
                break;
            case 'lin':
                ctx.moveTo(this.startX, this.startY)
                ctx.lineTo(this.endX, this.endY)
                ctx.stroke();
                return;
        }


        if (this.fill) {
            ctx.fill();
        } else {
            ctx.stroke();
        }
    }

    isInside(x: number, y: number): boolean {
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

    private lines: Shape[] = [];

    constructor(color: string, lineWidth: number, drawMode: boolean) {
        super(color, lineWidth, drawMode);
    }

    public addLine(x1: number, y1: number, x2: number, y2: number) {
        console.log("addLine from " + x1 + " " + y1 + " to " + x2 + " " + y2);
        this.lines.push(new Shape(x1, y1, x2, y2, this.color, this.lineWidth, false, 'lin', false));
        this.lines.push(new Shape(x2, y2, x2 + this.lineWidth / 4, y2 + this.lineWidth / 4, this.color, this.lineWidth / 2, true, 'cir', false));
        this.lastEdited = Date.now();
    }

    draw(ctx: CanvasRenderingContext2D): void {
        for (let i = 0; i < this.lines.length; i++) {
            this.lines[i].draw(ctx);
        }
    }

    isInside(x: number, y: number): boolean {
        return false;
    }
}

window.addEventListener("mousedown", (e) =>{
    Mousedown = true;
    selectedElement = null;

    prevX = e.clientX;
    prevY = e.clientY;


if(currentMode == 'bru'){
        shapes.push(new Brush(currentColor, currentlineW, true));
    }else if(currentMode == 'lin' || currentMode == 'rec' || currentMode == 'cir'){
        shapes.push(new Shape(prevX, prevY, prevX, prevY, currentColor, currentlineW, currentFill, currentMode , false));
    }
})

window.addEventListener("mouseup", (e) =>{
    Mousedown = false;

    const shape = shapes[shapes.length - 1];
    if (shape) {
        shape.drawMode = false;
    }

    drawShapes();

    prevX = -1;
    prevY = -1;
})

window.addEventListener("mousemove", (e) => {
    if (Mousedown) {
        if (currentMode == 'bru' && shapes[shapes.length - 1] instanceof Brush) {

                (shapes[shapes.length-1] as Brush).addLine(prevX, prevY, e.clientX, e.clientY);

                prevX = e.clientX;
                prevY = e.clientY;

        } else if ((currentMode == 'lin' || currentMode == 'rec' || currentMode == 'cir') && shapes[shapes.length - 1] instanceof Shape) {
            const shape: Shape = shapes.pop() as Shape;

            if (shape?.drawMode == true) {
                shape.endX = e.clientX;
                shape.endY = e.clientY;
                shapes.push(shape);
            }else{
                shapes.push(new Shape(prevX, prevY, e.clientX, e.clientY, currentColor, currentlineW, currentFill, currentMode, true));
            }
        }
        drawShapes();
    }
})

window.addEventListener("keydown", (e) => {
    if (e.key == 'b') {
        currentMode = 'bru';
    } else if (e.key == 'l') {
        currentMode = 'lin';
    } else if (e.key == 'r') {
        currentMode = 'rec';
    } else if (e.key == 'c') {
        currentMode = 'cir';
    } else if (e.key == 'f') {
        currentFill = !currentFill;
    } else if (e.key == 'ArrowUp') {
        currentlineW += 1;
    } else if (e.key == 'ArrowDown') {
        currentlineW -= 1;
    } 
})

function drawShapes() {
    console.info("drawShapes" + shapes.length);
        if (ctx) {
            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
            for (let i = 0; i < shapes.length; i++) {
                shapes[i].draw(ctx);
            }
        }
}