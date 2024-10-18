import { setCurrentlineW, setMode, redo, undo, setColorCustom, setCurrentFill, getCurrentFill, getIfShapesEmpty, getIfUndoEmpty } from "./index.js";
const saveButton = document.getElementById("saveButton");
saveButton.addEventListener("click", (e) => {
    var link = document.createElement('a');
    link.download = 'filename.png';
    link.href = document.getElementById('canvas').toDataURL();
    link.click();
});
const saveButtonMobile = document.getElementById("saveButtonMobile");
saveButtonMobile.addEventListener("click", (e) => {
    var link = document.createElement('a');
    link.download = 'filename.png';
    link.href = document.getElementById('canvas').toDataURL();
    link.click();
});
const brushButton = document.getElementById("brushButton");
brushButton.addEventListener("click", (e) => {
    unfokusButtons();
    brushButton.src = "Hover_Buttons/brush_hover.png";
    setMode('bru');
});
const brushButtonMobile = document.getElementById("brushButtonMobile");
brushButtonMobile.addEventListener("click", (e) => {
    unfokusButtons();
    brushButtonMobile.src = "Hover_Buttons/brush_hover.png";
    setMode('bru');
});
const lineButton = document.getElementById("lineButton");
lineButton.addEventListener("click", (e) => {
    unfokusButtons();
    lineButton.src = "Hover_Buttons/line_hover.png";
    setMode('lin');
});
const lineButtonMobile = document.getElementById("lineButtonMobile");
lineButtonMobile.addEventListener("click", (e) => {
    unfokusButtons();
    lineButtonMobile.src = "Hover_Buttons/line_hover.png";
    setMode('lin');
});
const circleButton = document.getElementById("circleButton");
circleButton.addEventListener("click", (e) => {
    unfokusButtons();
    circleButton.src = "Hover_Buttons/circle_hover.png";
    setMode('cir');
});
const circleButtonMobile = document.getElementById("circleButtonMobile");
circleButtonMobile.addEventListener("click", (e) => {
    unfokusButtons();
    circleButtonMobile.src = "Hover_Buttons/circle_hover.png";
    setMode('cir');
});
const rectangleButton = document.getElementById("recktangleButton");
rectangleButton.addEventListener("click", (e) => {
    unfokusButtons();
    rectangleButton.src = "Hover_Buttons/recktangle_hover.png";
    setMode('rec');
});
const rectangleButtonMobile = document.getElementById("recktangleButtonMobile");
rectangleButtonMobile.addEventListener("click", (e) => {
    unfokusButtons();
    rectangleButtonMobile.src = "Hover_Buttons/recktangle_hover.png";
    setMode('rec');
});
const eraserButton = document.getElementById("rubberButton");
eraserButton.addEventListener("click", (e) => {
    unfokusButtons();
    eraserButton.src = "Hover_Buttons/rubber_hover.png";
    setMode('era');
});
const eraserButtonMobile = document.getElementById("rubberButtonMobile");
eraserButtonMobile.addEventListener("click", (e) => {
    unfokusButtons();
    eraserButtonMobile.src = "Hover_Buttons/rubber_hover.png";
    setMode('era');
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
    setCurrentlineW(parseInt(slider.value));
});
const sliderMobile = document.getElementById("sliderMobile");
const sliderValueMobile = document.getElementById("sliderValueMobile");
sliderMobile.addEventListener("input", (e) => {
    setCurrentlineW(parseInt(sliderMobile.value));
});
const fillButton = document.getElementById("fillButton");
fillButton.addEventListener("click", (e) => {
    setCurrentFill();
    if (getCurrentFill()) {
        fillButton.src = "Hover_Buttons/fill_hover.png";
    }
    else {
        fillButton.src = "Color Images/fill.png";
    }
});
const fillButtonMobile = document.getElementById("fillButtonMobile");
fillButtonMobile.addEventListener("click", (e) => {
    setCurrentFill();
});
const pointButton = document.getElementById("pointerButton");
pointButton.addEventListener("click", (e) => {
    unfokusButtons();
    pointButton.src = "Hover_Buttons/pointer_hover.png";
    setMode('poi');
});
const pointButtonMobile = document.getElementById("pointerButtonMobile");
pointButtonMobile.addEventListener("click", (e) => {
    unfokusButtons();
    pointButtonMobile.src = "Hover_Buttons/pointer_hover.png";
    setMode('poi');
});
export function unfokusButtons() {
    brushButton.src = "Tools/paint-brush.png";
    lineButton.src = "Shape/line.png";
    circleButton.src = "Shape/circle.png";
    rectangleButton.src = "Shape/recktangle.png";
    eraserButton.src = "Tools/rubber.png";
    pointButton.src = "Tools/pointer.png";
    brushButtonMobile.src = "Tools/paint-brush.png";
    lineButtonMobile.src = "Shape/line.png";
    circleButtonMobile.src = "Shape/circle.png";
    rectangleButtonMobile.src = "Shape/recktangle.png";
    eraserButtonMobile.src = "Tools/rubber.png";
    pointButtonMobile.src = "Tools/pointer.png";
}
export function setColorPicker(color) {
    colorPicker.value = color;
    colorValue.innerText = color;
    colorPickerMobile.value = color;
    colorValueMobile.innerText = color;
}
export function setSliderValue(value) {
    slider.value = value.toString();
    sliderValue.innerText = value.toString();
    sliderMobile.value = value.toString();
    sliderValueMobile.innerText = value.toString();
}
export function updateUndoRedoButton() {
    const UndoEmpty = getIfShapesEmpty();
    const RedoEmpty = getIfUndoEmpty();
    if (UndoEmpty) {
        undoButton.src = "Hover_Buttons/Undo_hover.png";
        undoButtonMobile.src = "Hover_Buttons/Undo_hover.png";
    }
    else {
        undoButton.src = "Tools/UndoButton.png";
        undoButtonMobile.src = "Tools/UndoButton.png";
    }
    if (RedoEmpty) {
        redoButton.src = "Hover_Buttons/Redo_hover.png";
        redoButtonMobile.src = "Hover_Buttons/Redo_hover.png";
    }
    else {
        redoButton.src = "Tools/RedoButton.png";
        redoButtonMobile.src = "Tools/RedoButton.png";
    }
}
//# sourceMappingURL=buttonEvents.js.map