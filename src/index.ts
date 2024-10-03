//deklaration
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const board = document.querySelector('main') as HTMLBodyElement;

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var currentColor: string = '#000000';
var currentlineW: number = 5;
let currentFill: boolean = false;
let currentMode: string = 'bru';
let selectedElement: drawable | null = null;

let prevX: number = -1;
let prevY: number = -1;
let Mousedown: boolean = false;


let shapes: drawable[] = [];
let undoStack: drawable[] = [];

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

    public setLastEditedNow(): void {
        this.lastEdited = Date.now();
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
                const distance: number = Math.abs((this.endY - this.startY) * x - (this.endX - this.startX) * y + this.endX * this.startY - this.endY * this.startX) / Math.sqrt((this.endY - this.startY) ** 2 + (this.endX - this.startX) ** 2);

                const isBetweenPoints: boolean = x >= Math.min(this.startX, this.endX) && x <= Math.max(this.startX, this.endX) && y >= Math.min(this.startY, this.endY) && y <= Math.max(this.startY, this.endY);;
                
                return distance <= this.lineWidth / 2 && isBetweenPoints;
        }
        return false;
    }

}

class Brush extends drawable {

    private lines: Shape[] = [];

    constructor(color: string, lineWidth: number, drawMode: boolean) {
        super(color, lineWidth, drawMode);
    }

    public addLine(x1: number, y1: number, x2: number, y2: number, eraser: boolean): void {
        if(eraser){

            console.log("erase");
            this.lines.push(new Shape(x1, y1, x2, y2, 'rgba(255, 255, 255, 1)', this.lineWidth, false, 'lin', false));
            this.lastEdited = Date.now();
            
        }else{
            console.log("addLine from " + x1 + " " + y1 + " to " + x2 + " " + y2);
            this.lines.push(new Shape(x1, y1, x2, y2, this.color, this.lineWidth, false, 'lin', false));
            this.lines.push(new Shape(x2, y2, x2 + this.lineWidth / 4, y2 + this.lineWidth / 4, this.color, this.lineWidth / 2, true, 'cir', false));
        }
        this.lastEdited = Date.now();
    }

    draw(ctx: CanvasRenderingContext2D): void {
        for (let i = 0; i < this.lines.length; i++) {
            this.lines[i].draw(ctx);
        }
    }

    isInside(x: number, y: number): boolean {
        for (let i = 0; i < this.lines.length; i++) {
            if (this.lines[i].isInside(x, y)) {
                return true;
            }
        }

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

                (shapes[shapes.length-1] as Brush).addLine(prevX, prevY, e.clientX, e.clientY,false);

                prevX = e.clientX;
                prevY = e.clientY;

        }else if(currentMode == 'era') {

                console.log("erase");
                for (let i = 0; i < shapes.length; i++) {
                    if (shapes[i].isInside(e.clientX, e.clientY)) {
                        shapes[i].setLastEditedNow();
                        undoStack.push(shapes[i]);
                        shapes.splice(i, 1);
                    }
                }
            
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
        setMode('bru');
    } else if (e.key == 'l') {
        setMode('lin');
    }  else if (e.key == 'e') {
        setMode('era');
    }else if (e.key == 'r') {
        setMode('rec');
    } else if (e.key == 'c') {
        setMode('cir');
    } else if (e.key == 'f') {
        currentFill = !currentFill;
    } else if (e.key == 'ArrowUp') {
        currentlineW += 1;
    } else if (e.key == 'ArrowDown') {
        currentlineW -= 1;
    } else if (e.ctrlKey && e.key == 's') {
        e.preventDefault();
        saveButton.click();
    }else if (e.ctrlKey && e.key == 'z') {
        e.preventDefault();
        undo();
    } else if (e.ctrlKey && e.key == 'y') {
        e.preventDefault();
        redo();
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

function setMode(mode: string) {
    currentMode = mode;
    //buttons hervorheben
}

function setColorCustom(color: string) {
    currentColor = color;
}

function setColorButton(button: String) {
    if (button == 'blueButton') {
        currentColor = '#0000FF';
    }
    //buttons hervorheben
}

function undo() {
    if (shapes.length > 0) {
        let shape = shapes.pop() as drawable
        shape.setLastEditedNow();
        undoStack.push(shape);
        drawShapes();
    }
}

function redo() {
    if (undoStack.length > 0) {
        let shape = undoStack.pop() as drawable
        shape.setLastEditedNow();
        shapes.push(shape);
        drawShapes();
    }
}

const saveButton = document.getElementById("saveButton") as HTMLElement;
saveButton.addEventListener("click", (e) => {
    console.log("saveButton clicked");
    var link = document.createElement('a');
    link.download = 'filename.png';
    link.href = (document.getElementById('canvas') as HTMLCanvasElement).toDataURL()
    link.click();
})

const brushButton = document.getElementById("brushButton") as HTMLElement;
brushButton.addEventListener("click", (e) => {
    setMode('bru');
})

const lineButton = document.getElementById("lineButton") as HTMLElement;
lineButton.addEventListener("click", (e) => {
    setMode('lin');
})


const circleButton = document.getElementById("circleButton") as HTMLElement;
circleButton.addEventListener("click", (e) => {
    setMode('cir');
})

const rectangleButton = document.getElementById("rectangleButton") as HTMLElement;
rectangleButton.addEventListener("click", (e) => {
    setMode('rec');
})

const eraserButton = document.getElementById("rubberButton") as HTMLElement;
eraserButton.addEventListener("click", (e) => {
   setMode('era');

    //    //test
    //     currentColor = '#FF0000';
    //    for (let x = 0; x < window.innerWidth; x=x+4) {
    //     for (let y = 0; y < window.innerHeight; y=y+4) {
    //         for (let i = 0; i < shapes.length; i++) {
    //             if (shapes[i].isInside(x, y)) {
    //                 console.log("isInside " + x + " " + y);
    //                 ctx.beginPath();
    //                 ctx.arc(x, y, 2, 0, Math.PI * 2);
    //                 ctx.fillStyle = '#FF0000';
    //                 ctx.fill();
    //             }
    //         }
    //     }
    // }

})

const blueButton = document.getElementById("blueButton") as HTMLElement;
blueButton.addEventListener("click", (e) => {
    setColorButton('blueButton');
})

const redButton = document.getElementById("redButton") as HTMLElement;
redButton.addEventListener("click", (e) => {
    setColorCustom('#FF0000');
})

const greenButton = document.getElementById("greenButton") as HTMLElement;
greenButton.addEventListener("click", (e) => {
    setColorCustom('#009b00');
})

const pinkButton = document.getElementById("pinkButton") as HTMLElement;
pinkButton.addEventListener("click", (e) => {
    setColorCustom('#f200ff');
})

const yellowButton = document.getElementById("yellowButton") as HTMLElement;
yellowButton.addEventListener("click", (e) => {
    setColorCustom('#ffe000');
})


