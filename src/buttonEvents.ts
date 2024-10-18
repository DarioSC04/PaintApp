import {setCurrentlineW,setMode,redo,undo,setColorCustom,setCurrentFill } from "./index.js";

const saveButton = document.getElementById("saveButton") as HTMLElement;
saveButton.addEventListener("click", (e) => {
    var link = document.createElement('a');
    link.download = 'filename.png';
    link.href = (document.getElementById('canvas') as HTMLCanvasElement).toDataURL()
    link.click();
})
const saveButtonMobile = document.getElementById("saveButtonMobile") as HTMLElement;
saveButtonMobile.addEventListener("click", (e) => {
    var link = document.createElement('a');
    link.download = 'filename.png';
    link.href = (document.getElementById('canvas') as HTMLCanvasElement).toDataURL()
    link.click();
})

const brushButton = document.getElementById("brushButton") as HTMLInputElement;
brushButton.addEventListener("click", (e) => {
    setMode('bru');
})
const brushButtonMobile = document.getElementById("brushButtonMobile") as HTMLInputElement;
brushButtonMobile.addEventListener("click", (e) => {
    setMode('bru');
})

const lineButton = document.getElementById("lineButton") as HTMLInputElement;
lineButton.addEventListener("click", (e) => {
    setMode('lin');
})
const lineButtonMobile = document.getElementById("lineButtonMobile") as HTMLInputElement;
lineButtonMobile.addEventListener("click", (e) => {
    setMode('lin');
})

const circleButton = document.getElementById("circleButton") as HTMLInputElement;
circleButton.addEventListener("click", (e) => {
    setMode('cir');
})
const circleButtonMobile = document.getElementById("circleButtonMobile") as HTMLInputElement;
circleButtonMobile.addEventListener("click", (e) => {
    setMode('cir');
})

const rectangleButton = document.getElementById("recktangleButton") as HTMLInputElement;
rectangleButton.addEventListener("click", (e) => {
    setMode('rec');
})
const rectangleButtonMobile = document.getElementById("recktangleButtonMobile") as HTMLInputElement;
rectangleButtonMobile.addEventListener("click", (e) => {
    setMode('rec');
})

const eraserButton = document.getElementById("rubberButton") as HTMLInputElement;
eraserButton.addEventListener("click", (e) => {
   setMode('era');

})
const eraserButtonMobile = document.getElementById("rubberButtonMobile") as HTMLInputElement;
eraserButtonMobile.addEventListener("click", (e) => {
    setMode('era');
})

const blueButton = document.getElementById("blueButton") as HTMLElement;
blueButton.addEventListener("click", (e) => {
    setColorCustom('#0000FF');
})
const blueButtonMobile = document.getElementById("blueButtonMobile") as HTMLElement;
blueButtonMobile.addEventListener("click", (e) => {
    setColorCustom('#0000FF');
})

const redButton = document.getElementById("redButton") as HTMLElement;
redButton.addEventListener("click", (e) => {
    setColorCustom('#FF0000');
})
const redButtonMobile = document.getElementById("redButtonMobile") as HTMLElement;
redButtonMobile.addEventListener("click", (e) => {
    setColorCustom('#FF0000');
})

const greenButton = document.getElementById("greenButton") as HTMLElement;
greenButton.addEventListener("click", (e) => {
    setColorCustom('#009b00');
})
const greenButtonMobile = document.getElementById("greenButtonMobile") as HTMLElement;
greenButtonMobile.addEventListener("click", (e) => {
    setColorCustom('#009b00');
})

const pinkButton = document.getElementById("pinkButton") as HTMLElement;
pinkButton.addEventListener("click", (e) => {
    setColorCustom('#f200ff');
})
const pinkButtonMobile = document.getElementById("pinkButtonMobile") as HTMLElement;
pinkButtonMobile.addEventListener("click", (e) => {
    setColorCustom('#f200ff');
})

const yellowButton = document.getElementById("yellowButton") as HTMLElement;
yellowButton.addEventListener("click", (e) => {
    setColorCustom('#ffe000');
})
const yellowButtonMobile = document.getElementById("yellowButtonMobile") as HTMLElement;
yellowButtonMobile.addEventListener("click", (e) => {
    setColorCustom('#ffe000');
})

const undoButton = document.getElementById("undoButton") as HTMLElement;
undoButton.addEventListener("click", (e) => {
    undo();
});

const undoButtonMobile = document.getElementById("undoButtonMobile") as HTMLElement;
undoButtonMobile.addEventListener("click", (e) => {
    undo();
});

const redoButton = document.getElementById("redoButton") as HTMLInputElement;
redoButton.addEventListener("click", (e) => {
    redo();
    redoButton.src = "Hover_Buttons/Redo_hover.png";
});

const redoButtonMobile = document.getElementById("redoButtonMobile") as HTMLElement;
redoButtonMobile.addEventListener("click", (e) => {
    redo();
});

const colorPicker = document.getElementById("colorPicker") as HTMLInputElement;
const colorValue = document.getElementById("colorValue") as HTMLSpanElement;
colorPicker.addEventListener("input", (e) => {
    setColorCustom(colorPicker.value);
})

const colorPickerMobile = document.getElementById("colorPickerMobile") as HTMLInputElement;
const colorValueMobile = document.getElementById("colorValueMobile") as HTMLSpanElement;
colorPickerMobile.addEventListener("input", (e) => {
    setColorCustom(colorPickerMobile.value);
})

const slider = document.getElementById("slider") as HTMLInputElement;
const sliderValue = document.getElementById("sliderValue") as HTMLSpanElement;
slider.addEventListener("input", (e) => {
    setCurrentlineW(parseInt(slider.value));
})

const sliderMobile = document.getElementById("sliderMobile") as HTMLInputElement;
const sliderValueMobile = document.getElementById("sliderValueMobile") as HTMLSpanElement;
sliderMobile.addEventListener("input", (e) => {
    setCurrentlineW(parseInt(sliderMobile.value));
})

const fillButton = document.getElementById("fillButton") as HTMLInputElement;
fillButton.addEventListener("click", (e) => {
    setCurrentFill();
})
const fillButtonMobile = document.getElementById("fillButtonMobile") as HTMLInputElement;
fillButtonMobile.addEventListener("click", (e) => {
    setCurrentFill();
})

const pointButton = document.getElementById("pointerButton") as HTMLInputElement;
pointButton.addEventListener("click", (e) => {
    setMode('poi');
})
const pointButtonMobile = document.getElementById("pointerButtonMobile") as HTMLInputElement;
pointButtonMobile.addEventListener("click", (e) => {
    setMode('poi');
})

export function unfokusButtons(){
    brushButton.src = "Tools/paint-brush.png";
    lineButton.src = "Shape/line.png";
    circleButton.src = "Shape/circle.png";
    rectangleButton.src = "Shape/rectangle.png";
    eraserButton.src = "Tools/rubber.png";
    pointButton.src = "Tools/pointer.png";

    brushButtonMobile.src = "Tools/paint-brush.png";
    lineButtonMobile.src = "Shape/line.png";
    circleButtonMobile.src = "Shape/circle.png";
    rectangleButtonMobile.src = "Shape/rectangle.png";
    eraserButtonMobile.src = "Tools/rubber.png";
    pointButtonMobile.src = "Tools/pointer.png";
}

export function setColorPicker(color: string){
    colorPicker.value = color;
    colorValue.innerText = color;

    colorPickerMobile.value = color;
    colorValueMobile.innerText = color;
}

export function setSliderValue(value: number){
    slider.value = value.toString();
    sliderValue.innerText = value.toString();
    sliderMobile.value = value.toString();
    sliderValueMobile.innerText = value.toString();
}