export default class Lemon extends PIXI.Sprite {
    constructor({
        container,
        x,
        y,
    }) {
        super(PIXI.utils.TextureCache['lemon'])

        this.container = container
        this.container.addChild(this)

        this.x = x
        this.y = y
        this.anchor.set(0.5)
        this.scale.set(0.04)

        this.tl = new TimelineMax()

        this.toDelete = false

        this.fly()
    }


    fly() {
        if (!this.toDelete) {
            this.y = this.y - 10
            this.rotate()
        }
    }

    remove() {
        this.tl.pause()
        this.destroy()
    }

    hits(flower) {
        let lemonCenterX = this.x
        let lemonCenterY = this.y
        
        let flowerCenterX = flower.x
        let flowerCenterY = flower.y

        let lemonWidthHalf = this.width / 2
        let lemonHeightHalf = this.height / 2

        let flowerWidthHalf = flower.width / 2
        let flowerHeightHalf = flower.height / 2

        let vx = lemonCenterX - flowerCenterX
        let vy = lemonCenterY - flowerCenterY

        let combinedWidth = flowerWidthHalf + lemonWidthHalf
        let combinedHeight = flowerHeightHalf + lemonHeightHalf

        if (Math.abs(vx) < combinedWidth) {
            if (Math.abs(vy) < combinedHeight) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }

        return false
    }

    rotate() {
        this.tl.to(this, 1, {
            rotation: '+=1',
            onComplete: () => {
                this.rotate()
            }
        })
    }
    

}