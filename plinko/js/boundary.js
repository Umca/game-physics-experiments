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
        this.graph.beginFill(0xeeeeee);
        this.graph.drawRect(this.x, this.y, this.w, this.h);
        this.graph.pivot.y = this.h / 2
        this.graph.pivot.x = this.w / 2
        app.stage.addChild(this.graph)
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

