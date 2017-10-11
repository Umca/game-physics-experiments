export class Box{
    constructor(x, y, w, h, app, engine, isStatic) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.app = app;
        this.engine = engine;
        this.isStatic = isStatic;

        this.createBody();
        this.createGraphics();
    }
    createBody() {
        this.body = Matter.Bodies.rectangle(
            this.x,
            this.y,
            this.w,
            this.h,
            { isStatic: this.isStatic }
        );
        Matter.World.add(this.engine.world, this.body)
    }
    createGraphics() {
        this.graphics = new PIXI.Graphics();
        this.graphics.beginFill(0x1099bb);
        this.graphics.drawRect(0, 0, this.w, this.h);
        this.app.stage.addChild(this.graphics)
    }
    render() {
        this.graphics.x = this.body.position.x;
        this.graphics.y = this.body.position.y;
    }
}