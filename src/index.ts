import { drawable } from './classes/Drawable.js';
import { Shape } from './classes/Shape.js';
import { Brush } from './classes/Brush.js';

import { unfokusButtons,setColorPicker,setSliderValue } from './buttonEvents.js';

//deklaration
const canvas = document.getElementById("canvas") as HTMLCanvasElement;

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

export var currentColor: string = '#000000';
export var currentlineW: number = 5;
export let currentFill: boolean = false;
export let currentMode: string = 'bru';

let prevX: number = -1;
let prevY: number = -1;
let Mousedown: boolean = false;

const keyLokalStorage = 'drawShapes';

let shapes: drawable[] = [];
let undoStack: drawable[] = [];


const nav = document.querySelector('nav') as HTMLElement;
const aside = document.querySelector('aside') as HTMLElement;
const sidebar = document.querySelector('.sidebar') as HTMLElement;

//windowevents

window.addEventListener("mousedown", (e) =>{
    mousedown(e.clientX,e.clientY);
})

window.addEventListener("touchstart", (e) =>{
    if(e.touches[0] != undefined){
        mousedown(e.touches[0].clientX,e.touches[0].clientY);
    }
})

function mousedown(x:number,y:number){

    if(x < aside.clientWidth ||y < nav.clientHeight){
        return;
    }

    if(sidebar.style.display == "flex" && x > window.innerWidth - sidebar.clientWidth){
        return;
    }

    Mousedown = true;

    prevX = x;
    prevY = y;

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
}

window.addEventListener("mouseup", (e) =>{
    mouseup(e.clientX,e.clientY);
})

window.addEventListener("touchend", (e) =>{
    if(e.touches[0] != undefined){
        mouseup(e.touches[0].clientX,e.touches[0].clientY);
    }
})

window.addEventListener("touchcancel", (e) =>{
    if(e.touches[0] != undefined){
        mouseup(e.touches[0].clientX,e.touches[0].clientY);
    }
})

function mouseup(x:number,y:number){
    Mousedown = false;
    canvas.style.cursor = "default";

    const shape = shapes[shapes.length - 1];
    if (shape) {
        shape.drawMode = false;
    }

    prevX = -1;
    prevY = -1;
}

window.addEventListener("mousemove", (e) => {
    mousemove(e.clientX,e.clientY);
})

window.addEventListener("touchmove", (e) => {
    if(e.touches[0] != undefined){
        mousemove(e.touches[0].clientX,e.touches[0].clientY);
    }
})

function mousemove(x:number,y:number){
    if(x < aside.clientWidth ||y < nav.clientHeight){
        return;
    }

    if(sidebar.style.display == "flex" && x > window.innerWidth - sidebar.clientWidth){
        return;
    }

    if (Mousedown) {
        if (currentMode == 'bru' && shapes[shapes.length - 1] instanceof Brush) {

                (shapes[shapes.length-1] as Brush).addLine(prevX, prevY, x, y, ctx);
                localStorage.setItem(keyLokalStorage, JSON.stringify(shapes));

                prevX = x;
                prevY = y;

        }else if(currentMode == 'era') {

                for (let i = shapes.length-1; i >= 0; i--) {
                    if (shapes[i].isInside(x, y)) {
                        shapes[i].setLastEditedNow();
                        undoStack.push(shapes[i]);
                        shapes.splice(i, 1);
                    }
                }
            
                prevX = x;
                prevY = y;
                drawShapes();

        } else if(currentMode == 'poi'){
            for (let i = 0; i < shapes.length; i++) {
                if (shapes[i].seeOutline) {
                    shapes[i].move(x - prevX, y - prevY);
                }
            }

            prevX = x;
            prevY = y;
            drawShapes();

        }else if ((currentMode == 'lin' || currentMode == 'rec' || currentMode == 'cir') && shapes[shapes.length - 1] instanceof Shape) {
            const shape: Shape = shapes.pop() as Shape;

            if (shape?.drawMode == true) {
                shape.endX = x;
                shape.endY = y;
                shapes.push(shape);
            }else{
                shapes.push(new Shape(prevX, prevY, x, y, currentColor, currentlineW, currentFill, currentMode, true));
            }
            drawShapes();
        }
    }
}

window.addEventListener("keydown", (e) => {
    if (e.key == 'b') {
        setMode('bru',null);
    } else if (e.key == 'l') {
        setMode('lin',null);
    }  else if (e.key == 'e') {
        setMode('era',null);
    }else if (e.key == 'r') {
        setMode('rec',null);
    } else if (e.key == 'c') {
        setMode('cir',null);
    } else if (e.key == 'f') {
        currentFill = !currentFill;
    } else if (e.key == 'p') {
        setMode('poi',null);
    }else if (e.key == 'ArrowUp') {
        currentlineW += 1;
    } else if (e.key == 'ArrowDown') {
        currentlineW -= 1;
    } else if (e.ctrlKey && e.key == 's') {
        e.preventDefault();
        var link = document.createElement('a');
        link.download = 'filename.png';
        link.href = (document.getElementById('canvas') as HTMLCanvasElement).toDataURL()
        link.click();
    }else if (e.ctrlKey && e.key == 'z') {
        e.preventDefault();
        undo();
    } else if (e.ctrlKey && e.key == 'y') {
        e.preventDefault();
        redo();
    }
})

window.addEventListener("resize", (e) => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    drawShapes();

});

//helperfunctions

function drawShapes() {

    localStorage.setItem(keyLokalStorage, JSON.stringify(shapes));
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    shapes.sort((a, b) => a.getLastEdited() - b.getLastEdited());

    for (let i = 0; i < shapes.length; i++) {
        shapes[i].draw(ctx);
    }

        
}

export function setMode(mode: string, source:HTMLElement | null) {
    currentMode = mode;

    unfokusButtons();
    if(source != null){
        source.setAttribute("style","background: #686868;");
    }
    
    for (let i = 0; i < shapes.length; i++) {
        shapes[i].seeOutline = false;
    }

}

export function setColorCustom(color: string) {
    currentColor = color;
    setColorPicker(color);
}

export function setCurrentlineW(lineW: number) {
    setSliderValue(lineW);
    currentlineW = lineW;
}

export function setCurrentFill() {
    currentFill = !currentFill;
}

export function undo() {
    if (shapes.length > 0) {
        let shape = shapes.pop() as drawable
        shape.setLastEditedNow();
        undoStack.push(shape);
        drawShapes();
    }
}

export function redo() {
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

//localstorage

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

if (localStorage.getItem(keyLokalStorage)) {
    let shapesJSON = JSON.parse(localStorage.getItem(keyLokalStorage) as string);
    shapes = shapesFromJSON(shapesJSON);
    drawShapes();
}

//sidebar

function showSidebar() {
    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    sidebar.style.display = 'flex';
  }

  function hideSidebar() {
    const sidebar = document.querySelector('.sidebar') as HTMLElement;
    sidebar.style.display = 'none';
  }