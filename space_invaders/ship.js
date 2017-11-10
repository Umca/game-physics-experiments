export default class Ship extends PIXI.Container{
    constructor({ 
        container,
        x,
        y
    }) {
        super()

        this.container = container
        this.container.addChild(this)

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

    addPonyLeft() {
        this.ponyLeft = new PIXI.Sprite(PIXI.utils.TextureCache['pony'])
        this.ponyLeft.x = 0
        this.ponyLeft.y = 0
        this.addChild(this.ponyLeft)
    }
}