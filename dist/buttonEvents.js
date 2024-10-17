import { setCurrentlineW, setMode, redo, undo, setColorCustom, setCurrentFill } from "./index.js";
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
    sliderValueMobile.innerText = slider.value;
    sliderMobile.value = slider.value;
    setCurrentlineW(parseInt(slider.value));
});
const sliderMobile = document.getElementById("sliderMobile");
const sliderValueMobile = document.getElementById("sliderValueMobile");
sliderMobile.addEventListener("input", (e) => {
    sliderValueMobile.innerText = sliderMobile.value;
    sliderValue.innerText = sliderMobile.value;
    slider.value = sliderMobile.value;
    setCurrentlineW(parseInt(sliderMobile.value));
});
const fillButton = document.getElementById("fillButton");
fillButton.addEventListener("click", (e) => {
    setCurrentFill();
});
const fillButtonMobile = document.getElementById("fillButtonMobile");
fillButtonMobile.addEventListener("click", (e) => {
    setCurrentFill();
});
const pointButton = document.getElementById("pointerButton");
pointButton.addEventListener("click", (e) => {
    setMode('poi', e.target);
});
const pointButtonMobile = document.getElementById("pointerButtonMobile");
pointButtonMobile.addEventListener("click", (e) => {
    setMode('poi', e.target);
});
export function unfokusButtons() {
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
export function setColorPicker(color) {
    colorPicker.value = color;
    colorValue.innerText = color;
    colorPickerMobile.value = color;
    colorValueMobile.innerText = color;
}
//# sourceMappingURL=buttonEvents.js.map