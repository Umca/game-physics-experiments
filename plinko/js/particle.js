import { Bodies, World, world, app } from './constants.js'

export class Particle {
    constructor(x, y, r , options){
        this.x = x;
        this.y = y;
        this.r = r;
        this.options = options;
        this.create();
    }
    physicBody(){
        this.body = Bodies.circle(this.x, this.y, this.r, this.options);
        World.add( world, this.body )
    }
    graphicTexture() {
        this.graph = new PIXI.Graphics();
        this.graph.beginFill(0xffffff);
        this.graph.drawCircle(this.x, this.y, this.r);
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

    isOffScreen() {
        let x = this.body.position.x;
        let y = this.body.position.y;
        return x < -50 || x > app.view.width + 50 || y > app.view.height + 50
    }
}

