class Ball {
    static size = 50;
    static velocity = 3;
    static color = "#fcbe03";
    /**@param ctx {CanvasRenderingContext2D} */
    constructor(position, ctx, options) {
        this.x = position.x;
        this.y = position.y;
        this.size = Ball.size;
        this.ctx = ctx;
        this.color = options?.color ?? Ball.color;
    }
    setColor(color) {
        this.color = color;
    }
    setPosition(position) {
        this.x = position.x;
        this.y = position.y;
    }
    draw() {
        this.ctx.save();
        this.ctx.strokeStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.arc(this.x, this.y, this.size - 1, 0, 2 * Math.PI);
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.restore();
    }
}

class Block {
    static size = {
        x: 350,
        y: 200,
    };
    static color = "#75B9BE";
    /**
     *
     * @param {object} position
     * position may be structed as { x: number , y: number }
     * @param {CanvasRenderingContext2D} ctx
     * @param {object} options
     * for now only { color : "#colorHex" }
     */
    constructor(position, ctx, options) {
        this.x = position.x;
        this.y = position.y;
        this.size = {
            x: Block.size.x,
            y: Block.size.y,
        };
        this.ctx = ctx;
        this.color = options?.color ?? Block.color;
    }
    setColor(color) {
        this.color = color;
    }
    setCenterTo(x, y) {
        this.x = x - this.size.x / 2;
        this.y = y - this.size.y / 2;
    }
    draw() {
        this.ctx.save();
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.x, this.y, Block.size.x, Block.size.y);
        this.ctx.restore();
    }
}