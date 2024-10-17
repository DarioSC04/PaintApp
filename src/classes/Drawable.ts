export abstract class drawable {

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