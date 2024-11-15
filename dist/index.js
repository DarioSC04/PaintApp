import { Shape } from "./classes/Shape.js";
import { Brush } from "./classes/Brush.js";
import { setColorPicker, setSliderValue, updateUndoRedoButton } from "./buttonEvents.js";
const canvas = document.getElementById("canvas");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
const ctx = canvas.getContext("2d");
export var currentColor = "#000000";
export var currentlineW = 5;
export let currentFill = false;
export let currentMode = "bru";
let prevX = -1;
let prevY = -1;
let Mousedown = false;
const keyLokalStorage = "drawShapes";
let shapes = [];
let undoStack = [];
const nav = document.querySelector("nav");
const aside = document.querySelector("aside");
const sidebar = document.querySelector(".sidebar");
window.addEventListener("mousedown", (e) => {
    mousedown(e.clientX, e.clientY);
});
window.addEventListener("touchstart", (e) => {
    if (e.touches[0] != undefined) {
        mousedown(e.touches[0].clientX, e.touches[0].clientY);
    }
});
function mousedown(x, y) {
    if (x < aside.clientWidth || y < nav.clientHeight) {
        return;
    }
    if (sidebar.style.display == "flex" &&
        x > window.innerWidth - sidebar.clientWidth) {
        return;
    }
    Mousedown = true;
    prevX = x;
    prevY = y;
    if (currentMode != "poi") {
        canvas.style.cursor = "crosshair";
    }
    if (currentMode == "bru") {
        shapes.push(new Brush(currentColor, currentlineW, true));
    }
    else if (currentMode == "poi") {
        select(prevX, prevY);
    }
    else if (currentMode == "lin" ||
        currentMode == "rec" ||
        currentMode == "cir") {
        shapes.push(new Shape(prevX, prevY, prevX, prevY, currentColor, currentlineW, currentFill, currentMode, false));
    }
    updateUndoRedoButton();
}
window.addEventListener("mouseup", (e) => {
    mouseup(e.clientX, e.clientY);
});
window.addEventListener("touchend", (e) => {
    if (e.touches[0] != undefined) {
        mouseup(e.touches[0].clientX, e.touches[0].clientY);
    }
});
window.addEventListener("touchcancel", (e) => {
    if (e.touches[0] != undefined) {
        mouseup(e.touches[0].clientX, e.touches[0].clientY);
    }
});
function mouseup(x, y) {
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
    mousemove(e.clientX, e.clientY);
});
window.addEventListener("touchmove", (e) => {
    if (e.touches[0] != undefined) {
        mousemove(e.touches[0].clientX, e.touches[0].clientY);
    }
});
function mousemove(x, y) {
    if (x < aside.clientWidth || y < nav.clientHeight) {
        return;
    }
    if (sidebar.style.display == "flex" &&
        x > window.innerWidth - sidebar.clientWidth) {
        return;
    }
    if (Mousedown) {
        if (currentMode == "bru" && shapes[shapes.length - 1] instanceof Brush) {
            shapes[shapes.length - 1].addLine(prevX, prevY, x, y, ctx);
            localStorage.setItem(keyLokalStorage, JSON.stringify(shapes));
            prevX = x;
            prevY = y;
        }
        else if (currentMode == "era") {
            for (let i = shapes.length - 1; i >= 0; i--) {
                if (shapes[i].isInside(x, y)) {
                    shapes[i].setLastEditedNow();
                    undoStack.push(shapes[i]);
                    shapes.splice(i, 1);
                }
            }
            prevX = x;
            prevY = y;
            drawShapes();
        }
        else if (currentMode == "poi") {
            for (let i = 0; i < shapes.length; i++) {
                if (shapes[i].seeOutline) {
                    shapes[i].move(x - prevX, y - prevY);
                }
            }
            prevX = x;
            prevY = y;
            drawShapes();
        }
        else if ((currentMode == "lin" || currentMode == "rec" || currentMode == "cir") &&
            shapes[shapes.length - 1] instanceof Shape) {
            const shape = shapes.pop();
            if ((shape === null || shape === void 0 ? void 0 : shape.drawMode) == true) {
                shape.endX = x;
                shape.endY = y;
                shapes.push(shape);
            }
            else {
                shapes.push(new Shape(prevX, prevY, x, y, currentColor, currentlineW, currentFill, currentMode, true));
            }
            drawShapes();
        }
    }
}
window.addEventListener("resize", (e) => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    drawShapes();
});
function drawShapes() {
    localStorage.setItem(keyLokalStorage, JSON.stringify(shapes));
    updateUndoRedoButton();
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    shapes.sort((a, b) => a.getLastEdited() - b.getLastEdited());
    for (let i = 0; i < shapes.length; i++) {
        shapes[i].draw(ctx);
    }
}
export function setMode(mode) {
    currentMode = mode;
    for (let i = 0; i < shapes.length; i++) {
        shapes[i].seeOutline = false;
    }
}
export function setColorCustom(color) {
    currentColor = color;
    setColorPicker(color);
}
export function setCurrentlineW(lineW) {
    setSliderValue(lineW);
    currentlineW = lineW;
}
export function setCurrentFill() {
    currentFill = !currentFill;
}
export function getCurrentFill() {
    return currentFill;
}
export function undo() {
    if (shapes.length > 0) {
        let shape = shapes.pop();
        shape.setLastEditedNow();
        undoStack.push(shape);
        drawShapes();
    }
    updateUndoRedoButton();
}
export function redo() {
    if (undoStack.length > 0) {
        let shape = undoStack.pop();
        shape.setLastEditedNow();
        shapes.push(shape);
        drawShapes();
    }
    updateUndoRedoButton();
}
export function getIfShapesEmpty() {
    return shapes.length == 0;
}
export function getIfUndoEmpty() {
    return undoStack.length == 0;
}
function select(x, y) {
    let shape = isInsideObjekt(x, y);
    if (shape != null) {
        let before = shape.seeOutline;
        canvas.style.cursor = "grab";
        for (let i = 0; i < shapes.length; i++) {
            shapes[i].seeOutline = false;
        }
        shape.seeOutline = !before;
        shape.drawoutline(ctx);
    }
    else {
        for (let i = 0; i < shapes.length; i++) {
            shapes[i].seeOutline = false;
        }
    }
}
function isInsideObjekt(x, y) {
    for (let i = shapes.length - 1; i >= 0; i--) {
        if (shapes[i].isInside(x, y)) {
            return shapes[i];
        }
    }
    return null;
}
function shapesFromJSON(shapesJSON) {
    let shapes = [];
    for (let i = 0; i < shapesJSON.length; i++) {
        let shape = shapesJSON[i];
        if (shape.shape) {
            shapes.push(new Shape(shape.startX, shape.startY, shape.endX, shape.endY, shape.color, shape.lineWidth, shape.fill, shape.shape, shape.drawMode));
        }
        else {
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
    let shapesJSON = JSON.parse(localStorage.getItem(keyLokalStorage));
    shapes = shapesFromJSON(shapesJSON);
    drawShapes();
    updateUndoRedoButton();
}
//# sourceMappingURL=index.js.map