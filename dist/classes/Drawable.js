export class drawable {
    constructor(color, lineWidth, drawMode) {
        this.seeOutline = false;
        this.color = color;
        this.lineWidth = lineWidth;
        this.drawMode = drawMode;
        this.lastEdited = Date.now();
    }
    getLastEdited() {
        return this.lastEdited;
    }
    setLastEditedNow() {
        this.lastEdited = Date.now();
    }
}
//# sourceMappingURL=Drawable.js.map