import { Bodies, World, world, app } from './constants.js'

export class Boundary {
    constructor(x, y, w, h ) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.options = {
            isStatic: true
        };
        this.create();
    }
    physicBody() {
        this.body = Bodies.rectangle(this.x, this.y, this.w, this.h, this.options);
        World.add(world, this.body)
    }
    graphicTexture() {
        this.graph = new PIXI.Graphics();
        this.graph.beginFill(0xFFFFFF);
        this.graph.drawRect(0,0, this.w, this.h);
        this.graph.pivot.y = this.h / 2
        this.graph.pivot.x = this.w / 2
        this.graph.x = this.x
        this.graph.y = this.y
        app.stage.addChild(this.graph)
        window.bd = this.body
    }
    create() {
        return {
            body: this.physicBody(),
            texture: this.graphicTexture()
        }
    }
    render() {
        this.graph.x = this.body.position.x;
        this.graph.y = this.body.position.y;
    }
}

