import { drawable } from './Drawable.js';
import { Shape } from './Shape.js';
export class Brush extends drawable {
    constructor(color, lineWidth, drawMode) {
        super(color, lineWidth, drawMode);
        this.lines = [];
    }
    addLine(x1, y1, x2, y2, ctx) {
        this.lines.push(new Shape(x1, y1, x2, y2, this.color, this.lineWidth, false, 'lin', false));
        var circleRadius = 0.3928 * this.lineWidth - 0.444;
        this.lines.push(new Shape(x2, y2, x2 + circleRadius, y2 + circleRadius, this.color, 1, true, 'cir', false));
        this.lines[this.lines.length - 1].draw(ctx);
        this.lines[this.lines.length - 2].draw(ctx);
        this.lastEdited = Date.now();
    }
    draw(ctx) {
        for (let i = 0; i < this.lines.length; i++) {
            this.lines[i].draw(ctx);
        }
        if (this.seeOutline == true) {
            this.drawoutline(ctx);
        }
    }
    isInside(x, y) {
        for (let i = 0; i < this.lines.length; i++) {
            if (this.lines[i].isInside(x, y)) {
                return true;
            }
        }
        return false;
    }
    drawoutline(ctx) {
        let maxX = 0;
        let maxY = 0;
        let minX = window.innerWidth;
        let minY = window.innerHeight;
        for (let i = 0; i < this.lines.length; i++) {
            let points = this.lines[i].maxoutPoints();
            if (points == null) {
                continue;
            }
            maxX = Math.max(maxX, points[2]);
            maxY = Math.max(maxY, points[3]);
            minX = Math.min(minX, points[0]);
            minY = Math.min(minY, points[1]);
        }
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000000';
        ctx.setLineDash([5, 15]);
        ctx.rect(minX - 20, minY - 20, maxX - minX + 40, maxY - minY + 40);
        ctx.stroke();
        ctx.setLineDash([]);
    }
    move(x, y) {
        this.lastEdited = Date.now();
        for (let i = 0; i < this.lines.length; i++) {
            this.lines[i].move(x, y);
        }
    }
}
//# sourceMappingURL=Brush.js.map