export default class Flower extends PIXI.Sprite{
    constructor({
        container,
        x,
        y,
    }) {
        super(PIXI.utils.TextureCache['flower'])

        this.container = container
        this.container.addChild(this)

        this.x = x
        this.y = y
        this.anchor.set(0.5)
        this.scale.set(this.random(0.4, 0.5))

        this.tint = Math.random() * 0xFFFFFF

    }

    random(min, max) {
        return Math.floor(Math.random() * (max-min)) + min
    }

    rotate() {
        TweenMax.to(this, 1, {
            rotation: 2 * Math.PI,
            onComplete: () => {
                this.rotation = 0
            }
        })
    }

}