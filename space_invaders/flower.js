export default class Flower extends PIXI.Sprite{
    constructor({
        container,
        x,
        y,
    }) {
        super(PIXI.utils.TextureCache['flower'])

        this.container = container
        this.container.addChild(this)

        this.x = x + this.width / 2
        this.y = y
        this.anchor.set(0.5)
        this.scale.set(this.random(0.4, 0.5))
        this.dir = 1

        this.tint = Math.random() * 0xFFFFFF

    }

    random(min, max) {
        return Math.floor(Math.random() * (max-min)) + min
    }

    rotate() {
        TweenMax.to(this, 0.5, {
            rotation: 2 * Math.PI,
            onComplete: () => {
                this.rotation = 0
                this.visible = false
                this.toDelete = true
                this.remove()
                
            }
        })
       
    }
    remove() {
        this.destroy()
    }

    move() {
        this.x += 1 * this.dir
    }

    reachEdge() {
        return this.x  < this.width / 2 || this.x > app.view.width - this.width / 2
    }

    shiftDown() {
        this.y += 40
        this.dir *= -1
        app.game.edge = false
    }

}