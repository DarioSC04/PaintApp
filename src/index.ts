//deklaration
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

var currentColor: string = '#000000';
var currentlineW: number = 5;
let currentFill: boolean = false;
let currentMode: string = 'bru';

let prevX: number = -1;
let prevY: number = -1;
let Mousedown: boolean = false;

const keyLokalStorage = 'drawShapes';

let shapes: drawable[] = [];
let undoStack: drawable[] = [];

abstract class drawable {

    public color: string;
    protected lineWidth: number;
    protected lastEdited: number;
    public drawMode: boolean;
    public seeOutline: boolean = false;

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
    abstract drawoutline(ctx: CanvasRenderingContext2D): void;
    abstract move(x: number,y: number):void;
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

        if(this.seeOutline == true){
            this.drawoutline(ctx);
        }

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

    drawoutline(ctx: CanvasRenderingContext2D): void {

        ctx.beginPath()
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000000';
        ctx.setLineDash([5, 15]);

        const distance = 20;

        switch (this.shape) {
            case 'rec':
            case 'lin':
                if(this.startX<this.endX && this.startY<this.endY){
                    ctx.rect(this.startX -distance, this.startY -distance, this.endX - this.startX + distance* 2, this.endY - this.startY + distance*2)
                }else if (this.startX<this.endX && this.startY>this.endY){
                    ctx.rect(this.endX -distance, this.startY -distance, this.startX - this.endX + distance* 2, this.endY - this.startY + distance*2)
                }else if (this.startX>this.endX && this.startY<this.endY){
                    ctx.rect(this.startX -distance, this.endY -distance, this.endX - this.startX + distance* 2, this.startY - this.endY + distance*2)
                }else if (this.startX>this.endX && this.startY>this.endY){
                    ctx.rect(this.endX -distance, this.endY -distance, this.startX - this.endX + distance* 2, this.startY - this.endY + distance*2)
                }
                break;
            case 'cir':
                let radius = Math.sqrt((this.endX - this.startX) ** 2 + (this.endY - this.startY) ** 2);
                ctx.rect(this.startX - radius - distance, this.startY - radius - distance, radius * 2 + distance * 2, radius * 2 + distance * 2)
                break;
        }
        ctx.stroke();
        ctx.setLineDash([]);
    }
    
    move(x: number, y: number): void {
        this.startX+=x;
        this.endX+=x;

        this.startY+=y;
        this.endY+=y;

        this.setLastEditedNow();
    }

    maxoutPoints(): number[]|null {
        switch (this.shape) {
            case 'rec':
            case 'lin':
                if(this.startX<this.endX && this.startY<this.endY){
                    return [this.startX, this.startY, this.endX, this.endY];
                }else if (this.startX<this.endX && this.startY>this.endY){
                    return [this.endX, this.startY, this.startX, this.endY];
                }else if (this.startX>this.endX && this.startY<this.endY){
                    return [this.startX, this.endY, this.endX, this.startY];
                }else if (this.startX>this.endX && this.startY>this.endY){
                    return [this.endX, this.endY, this.startX, this.startY];
                }
                break;
            case 'cir':
                let radius = Math.sqrt((this.endX - this.startX) ** 2 + (this.endY - this.startY) ** 2);
                return [this.startX - radius, this.startY - radius, this.startX + radius, this.startY + radius];
                break;
        }
        return null;
    }


}

class Brush extends drawable {

    public lines: Shape[] = [];

    constructor(color: string, lineWidth: number, drawMode: boolean) {
        super(color, lineWidth, drawMode);
    }

    public addLine(x1: number, y1: number, x2: number, y2: number): void {
        
            console.log("addLine from " + x1 + " " + y1 + " to " + x2 + " " + y2);
            this.lines.push(new Shape(x1, y1, x2, y2, this.color, this.lineWidth, false, 'lin', false));
            var circleRadius = 0.3928 * this.lineWidth - 0.444; // mithilfe einer ausgleichsgerade berechnet
            this.lines.push(new Shape(x2, y2, x2 + circleRadius, y2 + circleRadius, this.color, 1 , true, 'cir', false));
        
        this.lastEdited = Date.now();
    }

    draw(ctx: CanvasRenderingContext2D): void {
        for (let i = 0; i < this.lines.length; i++) {
            this.lines[i].draw(ctx);
        }
        if(this.seeOutline == true){
            this.drawoutline(ctx);
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

    drawoutline(ctx: CanvasRenderingContext2D): void {

        let maxX = 0;
        let maxY = 0;
        let minX = window.innerWidth;
        let minY = window.innerHeight;

        for (let i = 0; i < this.lines.length; i++) {
            let points = this.lines[i].maxoutPoints();

            if(points == null){
                continue;
            }

            maxX = Math.max(maxX, points[2]);
            maxY = Math.max(maxY, points[3]);
            minX = Math.min(minX, points[0]);
            minY = Math.min(minY, points[1]);
        }

        ctx.beginPath()
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000000';
        ctx.setLineDash([5, 15]);

        ctx.rect(minX - 20, minY - 20, maxX - minX + 40, maxY - minY + 40)

        ctx.stroke();
        ctx.setLineDash([]);
    }

    move(x: number, y: number): void {
        this.lastEdited = Date.now();
        for (let i = 0; i < this.lines.length; i++) {
            this.lines[i].move(x, y);
        }
    }
}

const nav = document.querySelector('nav') as HTMLElement;
const aside = document.querySelector('aside') as HTMLElement;

window.addEventListener("mousedown", (e) =>{

    if(e.clientX < aside.clientWidth || e.clientY < nav.clientHeight){
        return;
    }

    Mousedown = true;

    prevX = e.clientX;
    prevY = e.clientY;

    if(currentMode != 'poi'){
        canvas.style.cursor = "crosshair";
    }

    if(currentMode == 'bru'){
        shapes.push(new Brush(currentColor, currentlineW, true));
    }else if(currentMode == 'poi'){
        select(prevX,prevY);
    }else if(currentMode == 'lin' || currentMode == 'rec' || currentMode == 'cir'){
        shapes.push(new Shape(prevX, prevY, prevX, prevY, currentColor, currentlineW, currentFill, currentMode , false));
    }
})

window.addEventListener("mouseup", (e) =>{
    Mousedown = false;
    canvas.style.cursor = "default";

    const shape = shapes[shapes.length - 1];
    if (shape) {
        shape.drawMode = false;
    }

    drawShapes();

    prevX = -1;
    prevY = -1;
})

window.addEventListener("mousemove", (e) => {

    if(e.clientX < aside.clientWidth || e.clientY < nav.clientHeight){
        return;
    }

    if (Mousedown) {
        if (currentMode == 'bru' && shapes[shapes.length - 1] instanceof Brush) {

                (shapes[shapes.length-1] as Brush).addLine(prevX, prevY, e.clientX, e.clientY);

                prevX = e.clientX;
                prevY = e.clientY;

        }else if(currentMode == 'era') {

                for (let i = shapes.length-1; i >= 0; i--) {
                    if (shapes[i].isInside(e.clientX, e.clientY)) {
                        shapes[i].setLastEditedNow();
                        undoStack.push(shapes[i]);
                        shapes.splice(i, 1);
                    }
                }
            
                prevX = e.clientX;
                prevY = e.clientY;

        } else if(currentMode == 'poi'){
            for (let i = 0; i < shapes.length; i++) {
                if (shapes[i].seeOutline) {
                    shapes[i].move(e.clientX - prevX, e.clientY - prevY);
                }
            }

            prevX = e.clientX;
            prevY = e.clientY;

        }else if ((currentMode == 'lin' || currentMode == 'rec' || currentMode == 'cir') && shapes[shapes.length - 1] instanceof Shape) {
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
    } else if (e.key == 'p') {
        setMode('poi');
    }else if (e.key == 'ArrowUp') {
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

    localStorage.setItem(keyLokalStorage, JSON.stringify(shapes));
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    shapes.sort((a, b) => a.getLastEdited() - b.getLastEdited());

    for (let i = 0; i < shapes.length; i++) {
        shapes[i].draw(ctx);
    }

        
}

function shapesFromJSON(shapesJSON: any[]): drawable[] {
    let shapes: drawable[] = [];

    for (let i = 0; i < shapesJSON.length; i++) {
        let shape = shapesJSON[i];
        if (shape.shape) {
            shapes.push(new Shape(shape.startX, shape.startY, shape.endX, shape.endY, shape.color, shape.lineWidth, shape.fill, shape.shape, shape.drawMode));
        }else{
             let brush = new Brush(shape.color, shape.lineWidth, shape.drawMode);
            for (let j = 0; j < shape.lines.length; j++) {
                let line = shape.lines[j];
                brush.lines.push(new Shape(line.startX, line.startY, line.endX, line.endY, line.color, line.lineWidth, line.fill, line.shape, line.drawMode));
            }
            shapes.push(brush);
        }
    }
    return shapes;
}

function setMode(mode: string) {
    currentMode = mode;
    
    for (let i = 0; i < shapes.length; i++) {
        shapes[i].seeOutline = false;
    }

}

function setColorCustom(color: string) {
    currentColor = color;
    colorPicker.value = color;
    colorValue.innerText = color;
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

function select(x: number, y:number){
    let shape = isInsideObjekt(x,y);

    if(shape != null ){
        let before: boolean = shape.seeOutline;
        canvas.style.cursor = "grab";
        for (let i = 0; i < shapes.length; i++) {
            shapes[i].seeOutline = false;
        }
        shape.seeOutline = !before;
        shape.drawoutline(ctx);
    }else{
        for (let i = 0; i < shapes.length; i++) {
            shapes[i].seeOutline = false;
        }
    }
}

function isInsideObjekt(x: number, y:number): drawable | null {
    for (let i = shapes.length-1; i >= 0; i--) {
        if (shapes[i].isInside(x, y)) {
            return shapes[i];
        }
    }
    return null;
}



window.addEventListener("resize", (e) => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    drawShapes();
});

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

const rectangleButton = document.getElementById("recktangleButton") as HTMLElement;
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
    setColorCustom('#0000FF');
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

const undoButton = document.getElementById("undoButton") as HTMLElement;
undoButton.addEventListener("click", (e) => {
    undo();
});

const redoButton = document.getElementById("redoButton") as HTMLElement;
redoButton.addEventListener("click", (e) => {
    redo();
});

const colorPicker = document.getElementById("colorPicker") as HTMLInputElement;
const colorValue = document.getElementById("colorValue") as HTMLSpanElement;
colorPicker.addEventListener("input", (e) => {
    setColorCustom(colorPicker.value);
})

const slider = document.getElementById("slider") as HTMLInputElement;
const sliderValue = document.getElementById("sliderValue") as HTMLSpanElement;
slider.addEventListener("input", (e) => {
    sliderValue.innerText = slider.value;
    currentlineW = parseInt(slider.value);
})

if (localStorage.getItem(keyLokalStorage)) {
    let shapesJSON = JSON.parse(localStorage.getItem(keyLokalStorage) as string);
    shapes = shapesFromJSON(shapesJSON);
    drawShapes();
}