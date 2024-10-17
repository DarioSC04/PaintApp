import { Shape } from './classes/Shape.js';
import { Brush } from './classes/Brush.js';
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
var currentColor = '#000000';
var currentlineW = 5;
let currentFill = false;
let currentMode = 'bru';
let prevX = -1;
let prevY = -1;
let Mousedown = false;
const keyLokalStorage = 'drawShapes';
let shapes = [];
let undoStack = [];
const nav = document.querySelector('nav');
const aside = document.querySelector('aside');
const sidebar = document.querySelector('.sidebar');
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
    if (sidebar.style.display == "flex" && x > window.innerWidth - sidebar.clientWidth) {
        return;
    }
    console.log(nav.clientWidth);
    Mousedown = true;
    prevX = x;
    prevY = y;
    if (currentMode != 'poi') {
        canvas.style.cursor = "crosshair";
    }
    if (currentMode == 'bru') {
        shapes.push(new Brush(currentColor, currentlineW, true));
    }
    else if (currentMode == 'poi') {
        select(prevX, prevY);
    }
    else if (currentMode == 'lin' || currentMode == 'rec' || currentMode == 'cir') {
        shapes.push(new Shape(prevX, prevY, prevX, prevY, currentColor, currentlineW, currentFill, currentMode, false));
    }
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
    if (sidebar.style.display == "flex" && x > window.innerWidth - sidebar.clientWidth) {
        return;
    }
    if (Mousedown) {
        if (currentMode == 'bru' && shapes[shapes.length - 1] instanceof Brush) {
            shapes[shapes.length - 1].addLine(prevX, prevY, x, y, ctx);
            prevX = x;
            prevY = y;
        }
        else if (currentMode == 'era') {
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
        else if (currentMode == 'poi') {
            for (let i = 0; i < shapes.length; i++) {
                if (shapes[i].seeOutline) {
                    shapes[i].move(x - prevX, y - prevY);
                }
            }
            prevX = x;
            prevY = y;
            drawShapes();
        }
        else if ((currentMode == 'lin' || currentMode == 'rec' || currentMode == 'cir') && shapes[shapes.length - 1] instanceof Shape) {
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
window.addEventListener("keydown", (e) => {
    if (e.key == 'b') {
        setMode('bru', null);
    }
    else if (e.key == 'l') {
        setMode('lin', null);
    }
    else if (e.key == 'e') {
        setMode('era', null);
    }
    else if (e.key == 'r') {
        setMode('rec', null);
    }
    else if (e.key == 'c') {
        setMode('cir', null);
    }
    else if (e.key == 'f') {
        currentFill = !currentFill;
    }
    else if (e.key == 'p') {
        setMode('poi', null);
    }
    else if (e.key == 'ArrowUp') {
        currentlineW += 1;
    }
    else if (e.key == 'ArrowDown') {
        currentlineW -= 1;
    }
    else if (e.ctrlKey && e.key == 's') {
        e.preventDefault();
        saveButton.click();
    }
    else if (e.ctrlKey && e.key == 'z') {
        e.preventDefault();
        undo();
    }
    else if (e.ctrlKey && e.key == 'y') {
        e.preventDefault();
        redo();
    }
});
function drawShapes() {
    localStorage.setItem(keyLokalStorage, JSON.stringify(shapes));
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    shapes.sort((a, b) => a.getLastEdited() - b.getLastEdited());
    for (let i = 0; i < shapes.length; i++) {
        shapes[i].draw(ctx);
    }
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
function setMode(mode, source) {
    currentMode = mode;
    unfokusButtons();
    if (source != null) {
        console.log(source);
        source.setAttribute("style", "background: #686868;");
    }
    for (let i = 0; i < shapes.length; i++) {
        shapes[i].seeOutline = false;
    }
}
function unfokusButtons() {
    brushButton.setAttribute("style", "background: #535353;");
    lineButton.setAttribute("style", "background: #535353;");
    circleButton.setAttribute("style", "background: #535353;");
    rectangleButton.setAttribute("style", "background: #535353;");
    eraserButton.setAttribute("style", "background: #535353;");
    pointButton.setAttribute("style", "background: #535353;");
    brushButtonMobile.setAttribute("style", "background: #535353;");
    lineButtonMobile.setAttribute("style", "background: #535353;");
    circleButtonMobile.setAttribute("style", "background: #535353;");
    rectangleButtonMobile.setAttribute("style", "background: #535353;");
    eraserButtonMobile.setAttribute("style", "background: #535353;");
    pointButtonMobile.setAttribute("style", "background: #535353;");
}
function setColorCustom(color) {
    currentColor = color;
    colorPicker.value = color;
    colorValue.innerText = color;
    colorPickerMobile.value = color;
    colorValueMobile.innerText = color;
}
function undo() {
    if (shapes.length > 0) {
        console.log("undo");
        let shape = shapes.pop();
        shape.setLastEditedNow();
        undoStack.push(shape);
        drawShapes();
    }
}
function redo() {
    if (undoStack.length > 0) {
        let shape = undoStack.pop();
        shape.setLastEditedNow();
        shapes.push(shape);
        drawShapes();
    }
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
window.addEventListener("resize", (e) => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    drawShapes();
});
const saveButton = document.getElementById("saveButton");
saveButton.addEventListener("click", (e) => {
    console.log("saveButton clicked");
    var link = document.createElement('a');
    link.download = 'filename.png';
    link.href = document.getElementById('canvas').toDataURL();
    link.click();
});
const saveButtonMobile = document.getElementById("saveButtonMobile");
saveButtonMobile.addEventListener("click", (e) => {
    console.log("saveButton clicked");
    var link = document.createElement('a');
    link.download = 'filename.png';
    link.href = document.getElementById('canvas').toDataURL();
    link.click();
});
const brushButton = document.getElementById("brushButton");
brushButton.addEventListener("click", (e) => {
    setMode('bru', e.target);
});
const brushButtonMobile = document.getElementById("brushButtonMobile");
brushButtonMobile.addEventListener("click", (e) => {
    setMode('bru', e.target);
});
const lineButton = document.getElementById("lineButton");
lineButton.addEventListener("click", (e) => {
    setMode('lin', e.target);
});
const lineButtonMobile = document.getElementById("lineButtonMobile");
lineButtonMobile.addEventListener("click", (e) => {
    setMode('lin', e.target);
});
const circleButton = document.getElementById("circleButton");
circleButton.addEventListener("click", (e) => {
    setMode('cir', e.target);
});
const circleButtonMobile = document.getElementById("circleButtonMobile");
circleButtonMobile.addEventListener("click", (e) => {
    setMode('cir', e.target);
});
const rectangleButton = document.getElementById("recktangleButton");
rectangleButton.addEventListener("click", (e) => {
    setMode('rec', e.target);
});
const rectangleButtonMobile = document.getElementById("recktangleButtonMobile");
rectangleButtonMobile.addEventListener("click", (e) => {
    setMode('rec', e.target);
});
const eraserButton = document.getElementById("rubberButton");
eraserButton.addEventListener("click", (e) => {
    setMode('era', e.target);
});
const eraserButtonMobile = document.getElementById("rubberButtonMobile");
eraserButtonMobile.addEventListener("click", (e) => {
    setMode('era', e.target);
});
const blueButton = document.getElementById("blueButton");
blueButton.addEventListener("click", (e) => {
    setColorCustom('#0000FF');
});
const blueButtonMobile = document.getElementById("blueButtonMobile");
blueButtonMobile.addEventListener("click", (e) => {
    setColorCustom('#0000FF');
});
const redButton = document.getElementById("redButton");
redButton.addEventListener("click", (e) => {
    setColorCustom('#FF0000');
});
const redButtonMobile = document.getElementById("redButtonMobile");
redButtonMobile.addEventListener("click", (e) => {
    setColorCustom('#FF0000');
});
const greenButton = document.getElementById("greenButton");
greenButton.addEventListener("click", (e) => {
    setColorCustom('#009b00');
});
const greenButtonMobile = document.getElementById("greenButtonMobile");
greenButtonMobile.addEventListener("click", (e) => {
    setColorCustom('#009b00');
});
const pinkButton = document.getElementById("pinkButton");
pinkButton.addEventListener("click", (e) => {
    setColorCustom('#f200ff');
});
const pinkButtonMobile = document.getElementById("pinkButtonMobile");
pinkButtonMobile.addEventListener("click", (e) => {
    setColorCustom('#f200ff');
});
const yellowButton = document.getElementById("yellowButton");
yellowButton.addEventListener("click", (e) => {
    setColorCustom('#ffe000');
});
const yellowButtonMobile = document.getElementById("yellowButtonMobile");
yellowButtonMobile.addEventListener("click", (e) => {
    setColorCustom('#ffe000');
});
const undoButton = document.getElementById("undoButton");
undoButton.addEventListener("click", (e) => {
    undo();
});
const undoButtonMobile = document.getElementById("undoButtonMobile");
undoButtonMobile.addEventListener("click", (e) => {
    undo();
});
const redoButton = document.getElementById("redoButton");
redoButton.addEventListener("click", (e) => {
    redo();
});
const redoButtonMobile = document.getElementById("redoButtonMobile");
redoButtonMobile.addEventListener("click", (e) => {
    redo();
});
const colorPicker = document.getElementById("colorPicker");
const colorValue = document.getElementById("colorValue");
colorPicker.addEventListener("input", (e) => {
    setColorCustom(colorPicker.value);
});
const colorPickerMobile = document.getElementById("colorPickerMobile");
const colorValueMobile = document.getElementById("colorValueMobile");
colorPickerMobile.addEventListener("input", (e) => {
    setColorCustom(colorPickerMobile.value);
});
const slider = document.getElementById("slider");
const sliderValue = document.getElementById("sliderValue");
slider.addEventListener("input", (e) => {
    sliderValue.innerText = slider.value;
    currentlineW = parseInt(slider.value);
});
const sliderMobile = document.getElementById("sliderMobile");
const sliderValueMobile = document.getElementById("sliderValueMobile");
sliderMobile.addEventListener("input", (e) => {
    sliderValueMobile.innerText = sliderMobile.value;
    currentlineW = parseInt(sliderMobile.value);
});
const fillButton = document.getElementById("fillButton");
fillButton.addEventListener("click", (e) => {
    currentFill = !currentFill;
});
const fillButtonMobile = document.getElementById("fillButtonMobile");
fillButtonMobile.addEventListener("click", (e) => {
    currentFill = !currentFill;
});
const pointButton = document.getElementById("pointerButton");
pointButton.addEventListener("click", (e) => {
    setMode('poi', e.target);
});
const pointButtonMobile = document.getElementById("pointerButtonMobile");
pointButtonMobile.addEventListener("click", (e) => {
    setMode('poi', e.target);
});
if (localStorage.getItem(keyLokalStorage)) {
    let shapesJSON = JSON.parse(localStorage.getItem(keyLokalStorage));
    shapes = shapesFromJSON(shapesJSON);
    drawShapes();
}
//# sourceMappingURL=index.js.map