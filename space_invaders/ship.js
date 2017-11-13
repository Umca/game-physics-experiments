export default class Pony extends PIXI.Container{
    constructor({ 
        container,
        x,
        y
    }) {
        super()

        this.container = container
        this.container.addChild(this)

        this.addPonyWin()
        this.addPonyLeft()

        this.pivot.x = this.width / 2
        this.pivot.y = this.height / 2
        this.scale.set(0.1)
        this.direction = 'left'
        this.newDirection = ''
        
        this.x = x / 2
        this.y = y - this.height / 2

        this.step = 10
        
        this.setStream()
    }

    setStream() {
        this.subscription = app.game.keys$
            .subscribe(next => { 
                if (next.code === 'ArrowLeft') {
                    this.newDirection = 'left'
                    this.move(-1)
                } else if (next.code === 'ArrowRight') {
                    this.newDirection = 'right'
                    this.move(1)
                }
            })
    }

    move(dir) {
        if (this.direction !== this.newDirection) {
            this.changeDirection()
            this.direction = this.newDirection
        }
        this.x = this.x + dir * this.step

    }

    changeDirection() {
        this.scale.x = this.scale.x * -1
    }

    changeTextureToWin() {
        TweenMax.to(this.ponyWin, 0, {
            alpha: 1
        })
        TweenMax.to(this.ponyLeft, 0, {
            alpha: 0
        })
    }

    addPonyLeft() {
        this.ponyLeft = new PIXI.Sprite(PIXI.utils.TextureCache['pony'])
        this.ponyLeft.x = 0
        this.ponyLeft.y = 0
        this.addChild(this.ponyLeft)
    }

    addPonyWin() {
        this.ponyWin = new PIXI.Sprite(PIXI.utils.TextureCache['pony_win'])
        this.ponyWin.x = 0
        this.ponyWin.y = 0
        this.addChild(this.ponyWin)
        this.ponyWin.alpha = 0
        this.ponyWin.scale.set(0.65)
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
}