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

const brushButton = document.getElementById("brushButton") as HTMLElement;
brushButton.addEventListener("click", (e) => {
    setMode('bru',e.target as HTMLElement);
})
const brushButtonMobile = document.getElementById("brushButtonMobile") as HTMLElement;
brushButtonMobile.addEventListener("click", (e) => {
    setMode('bru',e.target as HTMLElement);
})

const lineButton = document.getElementById("lineButton") as HTMLElement;
lineButton.addEventListener("click", (e) => {
    setMode('lin',e.target as HTMLElement);
})
const lineButtonMobile = document.getElementById("lineButtonMobile") as HTMLElement;
lineButtonMobile.addEventListener("click", (e) => {
    setMode('lin',e.target as HTMLElement);
})

const circleButton = document.getElementById("circleButton") as HTMLElement;
circleButton.addEventListener("click", (e) => {
    setMode('cir',e.target as HTMLElement);
})
const circleButtonMobile = document.getElementById("circleButtonMobile") as HTMLElement;
circleButtonMobile.addEventListener("click", (e) => {
    setMode('cir',e.target as HTMLElement);
})

const rectangleButton = document.getElementById("recktangleButton") as HTMLElement;
rectangleButton.addEventListener("click", (e) => {
    setMode('rec',e.target as HTMLElement);
})
const rectangleButtonMobile = document.getElementById("recktangleButtonMobile") as HTMLElement;
rectangleButtonMobile.addEventListener("click", (e) => {
    setMode('rec',e.target as HTMLElement);
})

const eraserButton = document.getElementById("rubberButton") as HTMLElement;
eraserButton.addEventListener("click", (e) => {
   setMode('era',e.target as HTMLElement);

})
const eraserButtonMobile = document.getElementById("rubberButtonMobile") as HTMLElement;
eraserButtonMobile.addEventListener("click", (e) => {
    setMode('era',e.target as HTMLElement);
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

const redoButton = document.getElementById("redoButton") as HTMLElement;
redoButton.addEventListener("click", (e) => {
    redo();
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

const fillButton = document.getElementById("fillButton") as HTMLElement;
fillButton.addEventListener("click", (e) => {
    setCurrentFill();
})
const fillButtonMobile = document.getElementById("fillButtonMobile") as HTMLElement;
fillButtonMobile.addEventListener("click", (e) => {
    setCurrentFill();
})

const pointButton = document.getElementById("pointerButton") as HTMLElement;
pointButton.addEventListener("click", (e) => {
    setMode('poi',e.target as HTMLElement);
})
const pointButtonMobile = document.getElementById("pointerButtonMobile") as HTMLElement;
pointButtonMobile.addEventListener("click", (e) => {
    setMode('poi',e.target as HTMLElement);
})

export function unfokusButtons(){
    brushButton.setAttribute("style","background: #535353;");
    lineButton.setAttribute("style","background: #535353;");
    circleButton.setAttribute("style","background: #535353;");
    rectangleButton.setAttribute("style","background: #535353;");
    eraserButton.setAttribute("style","background: #535353;");
    pointButton.setAttribute("style","background: #535353;");
    brushButtonMobile.setAttribute("style","background: #535353;");
    lineButtonMobile.setAttribute("style","background: #535353;");
    circleButtonMobile.setAttribute("style","background: #535353;");
    rectangleButtonMobile.setAttribute("style","background: #535353;");
    eraserButtonMobile.setAttribute("style","background: #535353;");
    pointButtonMobile.setAttribute("style","background: #535353;");
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